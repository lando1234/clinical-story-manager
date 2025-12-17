/**
 * Patient page loading state with skeleton UI
 * Mirrors the layout of the actual patient page
 */
export default function PatientLoading() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar skeleton */}
      <aside className="w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-screen flex-col">
          {/* Header skeleton */}
          <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Search skeleton */}
          <div className="p-4">
            <div className="h-10 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Patient list skeleton */}
          <div className="flex-1 space-y-2 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 rounded p-3">
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content skeleton */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-950">
        {/* Header skeleton */}
        <div className="border-b border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2">
              <div className="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Cargando historial del paciente...
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
