import { ReactNode } from 'react';

interface AppShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

/**
 * Main application shell with two-column layout:
 * - Fixed-width sidebar for patient navigation
 * - Flexible main content area for timeline and panels
 */
export function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {sidebar}
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
