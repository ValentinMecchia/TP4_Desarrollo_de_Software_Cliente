// No longer client component for auth checks
// 'use client'; removed

import AppSidebar from '@/components/layout/AppSidebar';
import AppHeader from '@/components/layout/AppHeader';
// import { ROUTES } from '@/constants/routes'; // No longer needed for redirection
// import { LoadingSpinner } from '@/components/common/LoadingSpinner'; // No longer needed for auth loading

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // All auth checks and loading states are removed.
  // The layout is always rendered.

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col md:ml-64"> {/* Adjust ml value if sidebar width changes */}
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
