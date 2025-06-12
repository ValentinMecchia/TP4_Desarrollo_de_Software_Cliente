import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';
import { FaGoogle } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [user, navigate]);

  const handleSignIn = () => {
    signInWithGoogle();
  };

  if (loading && !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-lg font-medium text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 animate-fade-in-up">
      <Card className="w-full max-w-md shadow-2xl border-border/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6">
            <Logo size="lg" />
          </div>
          <CardTitle className="font-headline text-3xl">Bienvenido de Nuevo</CardTitle>
          <CardDescription>Inicia sesión para acceder a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={handleSignIn}
            className="w-full text-base py-6 shadow-lg hover:shadow-primary/40"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner className="mr-2" />
            ) : (
              <FaGoogle className="mr-2 h-5 w-5" />
            )}
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión con Google'}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad (simulados).
          </p>
        </CardContent>
      </Card>
      <p className="mt-8 text-sm text-muted-foreground">
        SmartVest &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}
