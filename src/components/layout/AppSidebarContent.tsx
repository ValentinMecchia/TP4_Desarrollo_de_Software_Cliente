'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { LayoutDashboard, Briefcase, BarChart2, Newspaper, Settings } from 'lucide-react'; // LogOut removed
import { Logo } from '@/components/common/Logo';
// import { useAuth } from '@/contexts/AuthContext'; // Auth removed
// import { useRouter } from 'next/navigation'; // Router for signout removed

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.PORTFOLIOS, label: 'Portfolios', icon: Briefcase },
  { href: ROUTES.ASSETS, label: 'Assets', icon: BarChart2 },
  { href: ROUTES.NEWS, label: 'News & Insights', icon: Newspaper },
  { href: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
];

interface AppSidebarContentProps {
  isMobile?: boolean;
  onLinkClick?: () => void; // For mobile to close sheet
}

export default function AppSidebarContent({ isMobile = false, onLinkClick }: AppSidebarContentProps) {
  const pathname = usePathname();
  // const { signOut } = useAuth(); // Auth removed
  // const router = useRouter(); // Router for signout removed

  // const handleSignOut = async () => { // Sign out removed
  //   await signOut();
  //   router.push(ROUTES.LOGIN);
  //   if (onLinkClick) onLinkClick();
  // };

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <Logo size="md" className="text-sidebar-foreground" />
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid items-start gap-1 p-4">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} onClick={onLinkClick}>
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
      {/* Logout button section removed */}
    </div>
  );
}
