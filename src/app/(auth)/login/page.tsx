'use client';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';
import { ROUTES } from '@/constants/routes';

export default function LoginPage() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-headline font-semibold tracking-tight text-primary">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your portfolio.
        </p>
      </div>
      
      <AuthForm />
      
      <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href={ROUTES.REGISTER}
          className="font-medium text-primary hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
