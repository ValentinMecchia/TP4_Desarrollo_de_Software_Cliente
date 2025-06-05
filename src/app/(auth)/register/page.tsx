'use client';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';
import { ROUTES } from '@/constants/routes';

export default function RegisterPage() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-headline font-semibold tracking-tight text-primary">
          Create an Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join Smartfolio Sentinel to manage your investments.
        </p>
      </div>
      
      <AuthForm isRegister />
      
      <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-primary hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
