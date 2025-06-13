import { UserNav } from '@/components/layout/UserNav';
import { Logo } from '@/components/common/Logo';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import AppSidebarContent from './AppSidebarContent';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export default function AppHeader() {

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="md:hidden mr-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 bg-sidebar text-sidebar-foreground">
                <AppSidebarContent isMobile={true} />
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:block">
            <Logo size="sm" showText={false} />
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
