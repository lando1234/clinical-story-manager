'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

interface AppShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

const SidebarContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

/**
 * Main application shell with responsive two-column layout:
 * - Desktop: Fixed-width sidebar always visible
 * - Tablet: Sidebar can be toggled
 * - Mobile: Sidebar hidden by default, toggleable
 * Per spec: docs/26_responsive_behavior_spec.md
 */
export function AppShell({ sidebar, children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen: isSidebarOpen, setIsOpen: setIsSidebarOpen }}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-72 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900
            lg:relative lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {sidebar}
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-auto lg:ml-0">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed left-4 top-4 z-30 rounded-md bg-white p-2 shadow-lg lg:hidden dark:bg-gray-800"
            aria-label="Toggle sidebar"
          >
            <svg
              className="h-6 w-6 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
