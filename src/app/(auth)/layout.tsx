'use client';
import { Logo } from '@/components/common/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter }  from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/constants/routes';
import { Card, CardContent } from '@/components/ui/card';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [user, loading, router]);

  if (loading || (!loading && user)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
         {/* Optionally, add a loading spinner here */}
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-6 sm:p-8">
          {children}
        </CardContent>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Your Personalized Investment Dashboard
      </p>
    </main>
  );
}
