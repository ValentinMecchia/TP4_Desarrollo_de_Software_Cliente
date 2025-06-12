import AppSidebarContent from './AppSidebarContent';

export default function AppSidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed h-full">
       <AppSidebarContent />
    </aside>
  );
}
