import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';
import { FaGoogle } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { motion, AnimatePresence } from "framer-motion";
import LegalLinks from '@/components/auth/LegalLinks';

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
      <AnimatePresence>
        <motion.div
          className="flex min-h-screen flex-col items-center justify-center bg-background p-4"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.97 }}
          transition={{ duration: 0.5, type: "spring" }}
          style={{
            minHeight: "100vh",
            width: "100vw",
            overflow: "hidden",
            position: "fixed",
            inset: 0,
          }}
        >
          <LoadingSpinner size={48} />
          <p className="mt-4 text-lg font-medium text-muted-foreground">Cargando...</p>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (user) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 animate-fade-in-up"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.97 }}
        transition={{ duration: 0.5, type: "spring" }}
        style={{
          minHeight: "100vh",
          width: "100vw",
          overflow: "hidden",
          position: "fixed",
          inset: 0,
        }}
      >
        <Card className="w-full max-w-md shadow-2xl border-border/50 overflow-x-hidden overflow-y-visible">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 text-center flex flex-col items-center gap-2">
              <Logo size="lg" showText={false} />
              <p className="text-lg">SmartVest</p>
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
            <LegalLinks />
          </CardContent>
        </Card>
        <p className="mt-8 text-sm text-muted-foreground">
          SmartVest &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
