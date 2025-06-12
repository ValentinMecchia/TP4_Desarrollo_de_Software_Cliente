'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.DASHBOARD);
  }, [router]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
      <LoadingSpinner size={48} />
      <p className="mt-4 text-lg font-medium">Loading Smartfolio Sentinel...</p>
    </div>
  );
}
