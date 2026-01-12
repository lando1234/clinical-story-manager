import { describe, it, expect } from "vitest";
import {
  validateScheduledDate,
  validateScheduledTime,
  validateDuration,
  validateAppointmentType,
  validateScheduleAppointmentInput,
  validateUpdateAppointmentInput,
} from "@/domain/appointments/validation";
import {
  AppointmentStatus,
  AppointmentType,
  type Appointment,
} from "@/domain/appointments/types";

// COVE-1 references:
// - docs/specs/99_appendix/04_use_cases.md (scheduled date required valid date; duration optional but positive)
// - docs/specs/01_domain/02_domain.md (allowed appointment types list)

describe("Appointment validation", () => {
  // COVE-2 baseline: validation.ts had numerous uncovered branches (invalid date/time/type/duration paths)

  // COVE-3: invalid scheduled date should yield INVALID_SCHEDULED_DATE
  it("validateScheduledDate rejects invalid date input", () => {
    // COVE-1: Spec verified - scheduled date must be a valid date (docs/specs/99_appendix/04_use_cases.md)
    // COVE-2: Coverage verified - branch for invalid date was uncovered (validation.ts lines ~50-56)
    // COVE-3: Plan - pass an invalid Date and expect INVALID_SCHEDULED_DATE error
    const result = validateScheduledDate(new Date("invalid"));
    expect(result?.code).toBe("INVALID_SCHEDULED_DATE");
    expect(result?.field).toBe("scheduledDate");
  });

  // COVE-3: optional scheduledTime rejects non-date value
  it("validateScheduledTime rejects malformed scheduled time", () => {
    // COVE-1: Spec verified - scheduled time must be valid when provided (docs/specs/99_appendix/04_use_cases.md)
    // COVE-2: Coverage verified - invalid time branch was uncovered (validation.ts lines ~75-80)
    // COVE-3: Plan - pass a string instead of Date and expect INVALID_SCHEDULED_TIME
    const result = validateScheduledTime("10:00" as unknown as Date);
    expect(result?.code).toBe("INVALID_SCHEDULED_TIME");
    expect(result?.field).toBe("scheduledTime");
  });

  // COVE-3: duration must be positive integer
  it("validateDuration rejects non-positive duration", () => {
    // COVE-1: Spec verified - duration optional but must be positive if provided (docs/specs/99_appendix/04_use_cases.md)
    // COVE-2: Coverage verified - negative/zero duration branches were uncovered (validation.ts lines ~111-116)
    // COVE-3: Plan - provide a negative duration and expect INVALID_DURATION
    const result = validateDuration(-5);
    expect(result?.code).toBe("INVALID_DURATION");
    expect(result?.field).toBe("durationMinutes");
  });

  // COVE-3: appointment type must be one of allowed values
  it("validateAppointmentType rejects unknown type", () => {
    // COVE-1: Spec verified - appointment types enumerated in docs/specs/01_domain/02_domain.md
    // COVE-2: Coverage verified - invalid type branch was uncovered (validation.ts lines ~145-151)
    // COVE-3: Plan - pass an unsupported type and expect INVALID_APPOINTMENT_TYPE
    const result = validateAppointmentType("Cirugia" as AppointmentType);
    expect(result?.code).toBe("INVALID_APPOINTMENT_TYPE");
    expect(result?.field).toBe("appointmentType");
  });

  // COVE-3: composite validation returns first failing rule (invalid time)
  it("validateScheduleAppointmentInput returns invalid time before type when time is malformed", () => {
    // COVE-1: Spec verified - scheduling requires valid date/time before type (docs/specs/99_appendix/04_use_cases.md)
    // COVE-2: Coverage verified - scheduledTime invalid path in composite validator was uncovered
    // COVE-3: Plan - provide valid date, invalid time, valid type; expect INVALID_SCHEDULED_TIME
    const result = validateScheduleAppointmentInput({
      patientId: "p-1",
      scheduledDate: new Date("2024-05-01"),
      scheduledTime: "bad" as unknown as Date,
      appointmentType: AppointmentType.Psicoterapia,
    });
    expect(result?.code).toBe("INVALID_SCHEDULED_TIME");
  });

  // COVE-3: update validation accepts clearing optional fields when status allows modification
  it("validateUpdateAppointmentInput allows clearing optional fields for a schedulable appointment", () => {
    // COVE-1: Spec verified - scheduled appointments can be updated; time/duration optional (docs/specs/99_appendix/04_use_cases.md)
    // COVE-2: Coverage verified - update branches with provided null values were uncovered (validation.ts lines ~276-285)
    // COVE-3: Plan - pass Scheduled appointment and clear time/duration, keep valid type; expect null (valid)
    const appointment: Appointment = {
      id: "a-1",
      patientId: "p-1",
      scheduledDate: new Date("2024-05-01"),
      scheduledTime: new Date("2024-05-01T10:00:00Z"),
      durationMinutes: 60,
      appointmentType: AppointmentType.Psicoterapia,
      status: AppointmentStatus.Scheduled,
      notes: null,
      createdAt: new Date("2024-04-01T10:00:00Z"),
      updatedAt: new Date("2024-04-01T10:00:00Z"),
    };

    const result = validateUpdateAppointmentInput(appointment, {
      scheduledTime: null,
      durationMinutes: null,
      appointmentType: AppointmentType.OrientacionFamiliar,
    });

    expect(result).toBeNull();
  });
});

