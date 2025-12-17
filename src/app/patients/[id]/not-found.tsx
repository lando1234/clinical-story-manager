import Link from 'next/link';

/**
 * Not found page for non-existent patients
 * Displayed when a patient ID doesn't exist in the system
 */
export default function PatientNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <main className="text-center">
        <svg
          className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <h1 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Paciente no encontrado
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          El paciente solicitado no existe en el sistema.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
        >
          Volver al inicio
        </Link>
      </main>
    </div>
  );
}
