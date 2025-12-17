'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { Patient } from '@/types/ui';
import { PatientSearch } from './PatientSearch';
import { PatientList } from './PatientList';

interface PatientSidebarProps {
  selectedPatientId: string | null;
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Sidebar containing patient search and list
 * Fetches patients from backend API and handles search via API calls
 */
export function PatientSidebar({ selectedPatientId }: PatientSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch patients from API
  const fetchPatients = async (searchName?: string) => {
    try {
      setError(null);
      const isSearch = !!searchName?.trim();
      setIsSearching(isSearch);
      
      if (isSearch) {
        setLoadingState('loading');
      } else if (loadingState === 'idle') {
        setLoadingState('loading');
      }

      const params = new URLSearchParams();
      if (searchName?.trim()) {
        params.append('name', searchName.trim());
      }

      const url = `/api/patients${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al cargar pacientes');
      }

      const data = await response.json();
      setPatients(data);
      setLoadingState('success');
    } catch (err) {
      setLoadingState('error');
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSearching(false);
    }
  };

  // Initial load: fetch all patients
  useEffect(() => {
    fetchPatients();
  }, []);

  // Debounced search: fetch patients when search query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPatients(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Determine display state
  const isEmpty = patients.length === 0;
  const isInitialLoad = loadingState === 'idle' || loadingState === 'loading';
  const hasError = loadingState === 'error';
  const showEmptyState = isEmpty && !isInitialLoad && !hasError;

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Pacientes
          </h1>
          <Link
            href="/patients/new"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Nuevo
          </Link>
        </div>
      </div>

      {/* Search */}
      <PatientSearch value={searchQuery} onChange={setSearchQuery} />

      {/* Loading state */}
      {isInitialLoad && (
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Cargando pacientes...
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
              Error al cargar pacientes
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {error || 'No se pudo conectar con el servidor'}
            </p>
            <button
              onClick={() => fetchPatients(searchQuery)}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {showEmptyState && (
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
              {searchQuery.trim()
                ? 'No se encontraron pacientes que coincidan con la búsqueda'
                : 'No hay pacientes registrados'}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {searchQuery.trim()
                ? 'Intente con otros términos de búsqueda'
                : 'Cree su primer paciente para comenzar'}
            </p>
            {!searchQuery.trim() && (
              <Link
                href="/patients/new"
                className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Crear Paciente
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Patient list */}
      {!isInitialLoad && !hasError && !showEmptyState && (
        <PatientList patients={patients} selectedPatientId={selectedPatientId} />
      )}

      {/* Footer with count */}
      {!isInitialLoad && !hasError && !showEmptyState && (
        <div className="border-t border-gray-200 px-4 py-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
          {patients.length} {patients.length === 1 ? 'paciente' : 'pacientes'}
          {isSearching && ' (buscando...)'}
        </div>
      )}
    </div>
  );
}
