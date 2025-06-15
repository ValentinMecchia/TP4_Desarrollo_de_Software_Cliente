"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/constants/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const mockUserProfile = {
  displayName: "Demo User",
  email: "demo@example.com",
  photoURL: "https://placehold.co/40x40.png?text=DU",
};

export function UserNav() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  useEffect(() => {
    async function fetchUserProfile() {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUserProfile();
  }, [userId]);

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = profile?.nickName || user?.displayName || mockUserProfile.displayName;
  const email = profile?.email || user?.email || mockUserProfile.email;
  const photoURL = profile?.photoURL || user?.photoURL || mockUserProfile.photoURL;

  if (loading) return null; // o un spinner

  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button
            variant="ghost"
            className="w-full sm:w-auto h-12 min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center p-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
            tabIndex={0}
        >
            <Avatar className="h-9 w-9">
                <AvatarImage src={photoURL} alt={displayName || "User avatar"} />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
            </Avatar>
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">{email}</p>
            </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
            <DropdownMenuItem asChild>
                <Link to={ROUTES.SETTINGS} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
            </DropdownMenuItem>
        </DropdownMenuGroup>
    </DropdownMenuContent>
</DropdownMenu>
  );
}
