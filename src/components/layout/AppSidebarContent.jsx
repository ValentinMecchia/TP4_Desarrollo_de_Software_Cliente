'use client';

import { Link, useLocation } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { LayoutDashboard, Briefcase, BarChart2, Newspaper, Settings } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

const navItems = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.PORTFOLIOS, label: 'Portafolios', icon: Briefcase },
  { href: ROUTES.ASSETS, label: 'Acciones', icon: BarChart2 },
  { href: ROUTES.NEWS, label: 'Noticias', icon: Newspaper },
  
];

export default function AppSidebarContent({ isMobile = false, onLinkClick }) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <Logo size="md" className="text-sidebar-foreground" />
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid items-start gap-1 p-4">
          {navItems.map((item) => (
            <Link key={item.label} to={item.href} onClick={onLinkClick}>
              <Button
                variant={pathname === item.href ? 'default' : 'ghost'}
                className={cn(
                  "w-full justify-start text-base",
                  pathname === item.href 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
