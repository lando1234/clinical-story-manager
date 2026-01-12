import { describe, it, expect, beforeEach, vi } from "vitest";
import { AppointmentService } from "@/domain/appointments/service";
import { type AppointmentRepository } from "@/domain/appointments/repository";
import {
  AppointmentErrorCode,
  AppointmentStatus,
  AppointmentType,
  type Appointment,
  type ScheduleAppointmentInput,
  type UpdateAppointmentInput,
} from "@/domain/appointments/types";

type MockedRepo = {
  [K in keyof AppointmentRepository]: vi.MockInstance<
    ReturnType<AppointmentRepository[K]>,
    Parameters<AppointmentRepository[K]>
  >;
};

// Hoisted mocks for dependencies of AppointmentService
const mockRepo = vi.hoisted<MockedRepo>(() => ({
  patientExists: vi.fn(),
  create: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  cancel: vi.fn(),
  findMany: vi.fn(),
  findByPatientId: vi.fn(),
  findUpcomingByPatientId: vi.fn(),
}));

const mockValidateSchedule = vi.hoisted(() => vi.fn());
const mockValidateUpdate = vi.hoisted(() => vi.fn());
const mockValidateCancel = vi.hoisted(() => vi.fn());
const mockEnsureEncounter = vi.hoisted(() => vi.fn());
const mockDeleteEncounter = vi.hoisted(() => vi.fn());
const mockEmitScheduled = vi.hoisted(() => vi.fn());
const mockEmitUpdated = vi.hoisted(() => vi.fn());
const mockEmitCancelled = vi.hoisted(() => vi.fn());

vi.mock("@/domain/appointments/repository", () => ({
  appointmentRepository: mockRepo,
  AppointmentRepository: class {},
}));

vi.mock("@/domain/appointments/validation", () => ({
  validateScheduleAppointmentInput: mockValidateSchedule,
  validateUpdateAppointmentInput: mockValidateUpdate,
  validateCanCancel: mockValidateCancel,
}));

vi.mock("@/domain/appointments/encounter-event-generator", () => ({
  ensureEncounterEventForAppointment: mockEnsureEncounter,
  deleteEncounterEventForFutureAppointment: mockDeleteEncounter,
}));

vi.mock("@/domain/appointments/events", () => ({
  emitAppointmentScheduled: mockEmitScheduled,
  emitAppointmentUpdated: mockEmitUpdated,
  emitAppointmentCancelled: mockEmitCancelled,
}));

function makeAppointment(overrides: Partial<Appointment> = {}): Appointment {
  return {
    id: "a-1",
    patientId: "p-1",
    scheduledDate: new Date("2030-01-01T10:00:00Z"),
    scheduledTime: new Date("2030-01-01T10:00:00Z"),
    durationMinutes: 60,
    appointmentType: AppointmentType.Psicoterapia,
    status: AppointmentStatus.Scheduled,
    notes: null,
    createdAt: new Date("2029-12-01T10:00:00Z"),
    updatedAt: new Date("2029-12-01T10:00:00Z"),
    ...overrides,
  };
}

describe("AppointmentService", () => {
  const service = new AppointmentService(mockRepo);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // COVE-1: Spec verified - scheduling requires existing patient & valid input (docs/specs/99_appendix/04_use_cases.md)
  // COVE-2: Coverage verified - patient-not-found branch uncovered (service.ts ~63-72)
  // COVE-3: Plan - patientExists=false returns PATIENT_NOT_FOUND without creating
  it("scheduleAppointment returns patient not found when patient does not exist", async () => {
    mockRepo.patientExists.mockResolvedValue(false);

    const result = await service.scheduleAppointment({
      patientId: "missing",
      scheduledDate: new Date(),
      appointmentType: AppointmentType.Psicoterapia,
    } satisfies ScheduleAppointmentInput);

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(AppointmentErrorCode.PATIENT_NOT_FOUND);
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  // COVE-1: Spec verified - invalid schedule input rejected
  // COVE-2: Coverage verified - validation error branch uncovered (service.ts ~75-82)
  // COVE-3: Plan - validator returns error, service returns it and does not create
  it("scheduleAppointment returns validation error", async () => {
    mockRepo.patientExists.mockResolvedValue(true);
    mockValidateSchedule.mockReturnValue({
      code: AppointmentErrorCode.INVALID_SCHEDULED_DATE,
      message: "bad date",
      field: "scheduledDate",
    });

    const result = await service.scheduleAppointment({
      patientId: "p-1",
      scheduledDate: new Date("invalid"),
      appointmentType: AppointmentType.Psicoterapia,
    } satisfies ScheduleAppointmentInput);

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(AppointmentErrorCode.INVALID_SCHEDULED_DATE);
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  // COVE-1: Spec verified - Encounter event must be created, but failure should not break scheduling
  // COVE-2: Coverage verified - catch block for ensureEncounterEventForAppointment uncovered (service.ts ~88-97)
  // COVE-3: Plan - ensureEncounter throws, service still succeeds and emits event
  it("scheduleAppointment succeeds even if encounter event creation fails", async () => {
    const appointment = makeAppointment();
    mockRepo.patientExists.mockResolvedValue(true);
    mockValidateSchedule.mockReturnValue(null);
    mockRepo.create.mockResolvedValue(appointment);
    mockEnsureEncounter.mockRejectedValue(new Error("boom"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await service.scheduleAppointment({
      patientId: "p-1",
      scheduledDate: appointment.scheduledDate,
      appointmentType: AppointmentType.Psicoterapia,
    });
    consoleSpy.mockRestore();

    expect(result.success).toBe(true);
    expect(result.appointment).toEqual(appointment);
    expect(mockEmitScheduled).toHaveBeenCalledWith(appointment);
  });

  // COVE-1: Spec verified - updating requires existing appointment (docs/specs/99_appendix/04_use_cases.md)
  // COVE-2: Coverage verified - not-found branch uncovered (service.ts ~126-134)
  // COVE-3: Plan - findById returns null, expect APPOINTMENT_NOT_FOUND
  it("updateAppointment returns not found when appointment is missing", async () => {
    mockRepo.findById.mockResolvedValue(null);

    const result = await service.updateAppointment("missing", {});

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(AppointmentErrorCode.APPOINTMENT_NOT_FOUND);
    expect(mockRepo.update).not.toHaveBeenCalled();
  });

  // COVE-1: Spec verified - no-op updates should not emit events
  // COVE-2: Coverage verified - no-change path uncovered (service.ts ~150-157)
  // COVE-3: Plan - pass empty input, expect original appointment returned without update/event
  it("updateAppointment returns existing appointment when there are no changes", async () => {
    const existing = makeAppointment();
    mockRepo.findById.mockResolvedValue(existing);
    mockValidateUpdate.mockReturnValue(null);

    const result = await service.updateAppointment(existing.id, {});

    expect(result.success).toBe(true);
    expect(result.appointment).toEqual(existing);
    expect(mockRepo.update).not.toHaveBeenCalled();
    expect(mockEmitUpdated).not.toHaveBeenCalled();
  });

  // COVE-1: Spec verified - rescheduling futuro debe eliminar evento previo y crear nuevo
  // COVE-2: Coverage verified - branches for future reschedule and ensure/delete encounter uncovered (service.ts ~162-193)
  // COVE-3: Plan - future date change triggers deleteEncounterEventForFutureAppointment then ensureEncounterEventForAppointment
  it("updateAppointment reschedules future appointment and recreates encounter event", async () => {
    const existing = makeAppointment({ scheduledDate: new Date(Date.now() + 86400000) });
    const updated = makeAppointment({ id: existing.id, scheduledDate: new Date(Date.now() + 2 * 86400000) });
    mockRepo.findById.mockResolvedValue(existing);
    mockValidateUpdate.mockReturnValue(null);
    mockRepo.update.mockResolvedValue(updated);
    mockEnsureEncounter.mockResolvedValue(undefined); // avoid console error in test

    const result = await service.updateAppointment(existing.id, {
      scheduledDate: updated.scheduledDate,
    } satisfies UpdateAppointmentInput);

    expect(result.success).toBe(true);
    expect(mockDeleteEncounter).toHaveBeenCalledWith(existing.id);
    expect(mockEnsureEncounter).toHaveBeenCalledWith(updated.id);
    expect(mockEmitUpdated).toHaveBeenCalled();
  });

  // COVE-1: Spec verified - cancelación requiere estado cancelable (docs/specs/99_appendix/04_use_cases.md)
  // COVE-2: Coverage verified - validateCanCancel error branch uncovered (service.ts ~232-238)
  // COVE-3: Plan - validator returns error, service returns it without cancel
  it("cancelAppointment returns validation error when cannot cancel", async () => {
    const existing = makeAppointment();
    mockRepo.findById.mockResolvedValue(existing);
    mockValidateCancel.mockReturnValue({
      code: AppointmentErrorCode.CANNOT_CANCEL_COMPLETED,
      message: "completed",
    });

    const result = await service.cancelAppointment(existing.id);

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe(AppointmentErrorCode.CANNOT_CANCEL_COMPLETED);
    expect(mockRepo.cancel).not.toHaveBeenCalled();
  });

  // COVE-1: Spec verified - cancelar turno futuro debe borrar encounter
  // COVE-2: Coverage verified - future cancel branch uncovered (service.ts ~241-260)
  // COVE-3: Plan - future appointment cancel triggers deleteEncounterEventForFutureAppointment and emits event
  it("cancelAppointment for future appointment deletes encounter event and succeeds", async () => {
    const future = makeAppointment({ scheduledDate: new Date(Date.now() + 86400000) });
    mockRepo.findById.mockResolvedValue(future);
    mockValidateCancel.mockReturnValue(null);
    mockRepo.cancel.mockResolvedValue({ ...future, status: AppointmentStatus.Cancelled });

    const result = await service.cancelAppointment(future.id, { reason: "patient request" });

    expect(result.success).toBe(true);
    expect(mockDeleteEncounter).toHaveBeenCalledWith(future.id);
    expect(mockEmitCancelled).toHaveBeenCalled();
  });

  // ==========================================================================
  // QUERIES
  // ==========================================================================

  it("getAppointment delegates to repository", async () => {
    const appt = makeAppointment({ id: "appt-1" });
    mockRepo.findById.mockResolvedValue(appt);

    const result = await service.getAppointment("appt-1");

    expect(result).toEqual(appt);
    expect(mockRepo.findById).toHaveBeenCalledWith("appt-1");
  });

  it("getAppointments passes options to repository", async () => {
    const appts = [makeAppointment({ id: "a1" }), makeAppointment({ id: "a2" })];
    mockRepo.findMany.mockResolvedValue(appts);

    const options = { status: [AppointmentStatus.Scheduled], limit: 10 };
    const result = await service.getAppointments(options);

    expect(result).toEqual(appts);
    expect(mockRepo.findMany).toHaveBeenCalledWith(options);
  });

  it("getPatientAppointments delegates to repository with patientId", async () => {
    const appts = [makeAppointment({ id: "p1-a1", patientId: "p-123" })];
    mockRepo.findByPatientId.mockResolvedValue(appts);

    const result = await service.getPatientAppointments("p-123");

    expect(result).toEqual(appts);
    expect(mockRepo.findByPatientId).toHaveBeenCalledWith("p-123");
  });

  it("getUpcomingAppointments delegates to repository with patientId", async () => {
    const appts = [makeAppointment({ id: "up-1", patientId: "p-123" })];
    mockRepo.findUpcomingByPatientId.mockResolvedValue(appts);

    const result = await service.getUpcomingAppointments("p-123");

    expect(result).toEqual(appts);
    expect(mockRepo.findUpcomingByPatientId).toHaveBeenCalledWith("p-123");
  });

  // ==========================================================================
  // PRIVATE HELPERS COVERAGE THROUGH updateAppointment
  // ==========================================================================

  it("updateAppointment detects time change and emits event with previous values", async () => {
    const existing = makeAppointment({
      id: "appt-2",
      scheduledDate: new Date("2030-01-01T10:00:00Z"),
      scheduledTime: new Date("2030-01-01T10:00:00Z"),
      durationMinutes: 60,
      appointmentType: AppointmentType.Psicoterapia,
      notes: "old notes",
    });
    const updated = makeAppointment({
      ...existing,
      scheduledTime: new Date("2030-01-01T11:00:00Z"),
      durationMinutes: 90,
      appointmentType: AppointmentType.OrientacionFamiliar,
      notes: "new notes",
    });

    mockRepo.findById.mockResolvedValue(existing);
    mockValidateUpdate.mockReturnValue(null);
    mockRepo.update.mockResolvedValue(updated);
    mockEnsureEncounter.mockResolvedValue(undefined);

    await service.updateAppointment(existing.id, {
      scheduledTime: updated.scheduledTime,
      durationMinutes: updated.durationMinutes,
      appointmentType: updated.appointmentType,
      notes: updated.notes,
    } satisfies UpdateAppointmentInput);

    // ensures hasChanges saw updates and repo.update was invoked
    expect(mockRepo.update).toHaveBeenCalledWith(existing.id, expect.objectContaining({
      scheduledTime: updated.scheduledTime,
      durationMinutes: updated.durationMinutes,
      appointmentType: updated.appointmentType,
      notes: updated.notes,
    }));

    // capturePreviousValues should include changed fields in emit payload
    expect(mockEmitUpdated).toHaveBeenCalledWith(
      updated,
      expect.objectContaining({
        scheduledTime: existing.scheduledTime,
        durationMinutes: existing.durationMinutes,
        appointmentType: existing.appointmentType,
        notes: existing.notes,
      }),
      expect.objectContaining({
        scheduledTime: updated.scheduledTime,
        durationMinutes: updated.durationMinutes,
        appointmentType: updated.appointmentType,
        notes: updated.notes,
      })
    );
  });
});

