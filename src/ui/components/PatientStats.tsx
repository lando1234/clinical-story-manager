'use client';

import { useEffect, useState } from 'react';

interface PatientStatsData {
  total: number;
  active: number;
  inactive: number;
}

/**
 * Patient statistics component with pie chart
 * Shows total, active, and inactive patient counts
 * Informative only - no clinical interactions
 */
export function PatientStats() {
  const [stats, setStats] = useState<PatientStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/stats/patients');
        if (!response.ok) {
          throw new Error('Error al cargar estadísticas');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Estadísticas de Pacientes
        </h2>
        <div className="mt-4 flex items-center justify-center py-8">
          <div className="text-sm text-gray-500 dark:text-gray-400">Cargando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Estadísticas de Pacientes
        </h2>
        <div className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const { total, active, inactive } = stats;

  // Calculate angles for pie chart
  const radius = 80;
  const centerX = 100;
  const centerY = 100;
  const circumference = 2 * Math.PI * radius;

  const activePercentage = total > 0 ? (active / total) * 100 : 0;
  const inactivePercentage = total > 0 ? (inactive / total) * 100 : 0;

  // Calculate stroke-dashoffset for each segment
  // Active segment: starts at -90deg, shows active percentage
  const activeDashLength = (activePercentage / 100) * circumference;
  const activeOffset = circumference - activeDashLength;
  
  // Inactive segment: starts after active segment, shows inactive percentage
  const inactiveDashLength = (inactivePercentage / 100) * circumference;
  const inactiveOffset = circumference - inactiveDashLength;
  const inactiveRotation = -90 + (activePercentage * 360) / 100;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Estadísticas de Pacientes
      </h2>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
        {/* Pie Chart */}
        <div className="flex-shrink-0">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* Active segment */}
            {active > 0 && (
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="40"
                strokeDasharray={circumference}
                strokeDashoffset={activeOffset}
                transform={`rotate(-90 ${centerX} ${centerY})`}
                className="transition-all duration-300"
              />
            )}
            {/* Inactive segment */}
            {inactive > 0 && (
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="#9ca3af"
                strokeWidth="40"
                strokeDasharray={circumference}
                strokeDashoffset={inactiveOffset}
                transform={`rotate(${inactiveRotation} ${centerX} ${centerY})`}
                className="transition-all duration-300"
              />
            )}
            {/* Center text */}
            <text
              x={centerX}
              y={centerY - 10}
              textAnchor="middle"
              className="text-2xl font-bold fill-gray-900 dark:fill-gray-100"
            >
              {total}
            </text>
            <text
              x={centerX}
              y={centerY + 15}
              textAnchor="middle"
              className="text-sm fill-gray-600 dark:fill-gray-400"
            >
              Total
            </text>
          </svg>
        </div>

        {/* Statistics */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-blue-500"></div>
            <div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {active}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Activos
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-gray-400"></div>
            <div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {inactive}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Inactivos
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






