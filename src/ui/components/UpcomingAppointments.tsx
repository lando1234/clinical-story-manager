'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UpcomingAppointment {
  id: string;
  patientId: string;
  patientName: string;
  scheduledDate: string;
  scheduledTime: string | null;
  appointmentType: string;
}

/**
 * Upcoming appointments component
 * Shows appointments scheduled for the next 7 days
 * Allows navigation to patient clinical record
 */
export function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<UpcomingAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/appointments/upcoming');
        if (!response.ok) {
          throw new Error('Error al cargar turnos próximos');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return null;
    return timeString;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Turnos Próximos (7 días)
      </h2>

      {loading && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Cargando...
        </div>
      )}

      {error && (
        <div className="mt-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          No hay turnos programados para los próximos 7 días
        </div>
      )}

      {!loading && !error && appointments.length > 0 && (
        <div className="mt-4 space-y-3">
          {appointments.map((appointment) => (
            <Link
              key={appointment.id}
              href={`/patients/${appointment.patientId}`}
              className="block rounded-md border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {appointment.patientName}
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{formatDate(appointment.scheduledDate)}</span>
                    {appointment.scheduledTime && (
                      <span>{formatTime(appointment.scheduledTime)}</span>
                    )}
                  </div>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
