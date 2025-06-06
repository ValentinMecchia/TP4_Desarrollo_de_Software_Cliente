'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { useAuth } from '@/contexts/AuthContext'; // Using mock data directly
import { Settings } from 'lucide-react';
// import { useRouter } from 'next/navigation'; // No more sign out
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';

// Mock user profile for display
const mockUserProfile = {
  displayName: "Demo User",
  email: "demo@example.com",
  photoURL: "https://placehold.co/40x40.png?text=DU",
};

export function UserNav() {
  // const router = useRouter(); // No longer needed for sign out

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U'; // User initial
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={mockUserProfile.photoURL || undefined} alt={mockUserProfile.displayName || 'User avatar'} />
            <AvatarFallback>{getInitials(mockUserProfile.displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{mockUserProfile.displayName || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {mockUserProfile.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.SETTINGS} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* Sign out item removed */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
