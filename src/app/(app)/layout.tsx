
import AppSidebar from '@/components/layout/AppSidebar';
import AppHeader from '@/components/layout/AppHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col md:ml-64"> {/* Adjust ml value if sidebar width changes */}
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  );
}
