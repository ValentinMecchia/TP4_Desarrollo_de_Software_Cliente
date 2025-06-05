'use client';

import *_ from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Github, Chrome } from 'lucide-react'; // Using Chrome for Google icon
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithGitHub,
} from '@/services/authService';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type AuthFormValues = z.infer<typeof formSchema>;

interface AuthFormProps {
  isRegister?: boolean;
}

export function AuthForm({ isRegister = false }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      if (isRegister) {
        await signUpWithEmail(values.email, values.password);
        toast({ title: 'Registration Successful', description: 'Please login to continue.' });
        router.push(ROUTES.LOGIN);
      } else {
        await signInWithEmail(values.email, values.password);
        toast({ title: 'Login Successful', description: 'Welcome back!' });
        router.push(ROUTES.DASHBOARD);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithGitHub();
      }
      toast({ title: 'Login Successful', description: 'Welcome!' });
      router.push(ROUTES.DASHBOARD);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Social Login Failed',
        description: error.message || `Failed to login with ${provider}.`,
      });
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              disabled={isLoading || !!socialLoading}
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              disabled={isLoading || !!socialLoading}
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !!socialLoading}>
            {isLoading && <LoadingSpinner size={16} className="mr-2" />}
            {isRegister ? 'Create an account' : 'Sign In'}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" onClick={() => handleSocialLogin('google')} disabled={isLoading || !!socialLoading}>
          {socialLoading === 'google' ? <LoadingSpinner size={16} className="mr-2"/> : <Chrome className="mr-2 h-4 w-4" />}
          Google
        </Button>
        <Button variant="outline" onClick={() => handleSocialLogin('github')} disabled={isLoading || !!socialLoading}>
          {socialLoading === 'github' ? <LoadingSpinner size={16} className="mr-2"/> : <Github className="mr-2 h-4 w-4" />}
          GitHub
        </Button>
      </div>
    </div>
  );
}
