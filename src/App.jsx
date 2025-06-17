import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Portfolios from './pages/Portfolios';
import Assets from './pages/Assets';
import News from './pages/News';
import Settings from './pages/Settings';
import LoginPage from './pages/Login';
import { ROUTES } from '@/constants/routes';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Componente para proteger rutas privadas
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null; // O un spinner global
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path={ROUTES.PRIVACYPOLICY} element={<PrivacyPolicy />} />
          <Route path={ROUTES.TERMS} element={<TermsOfService />} />
          <Route
            path="*"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                    <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                    <Route path={ROUTES.PORTFOLIOS} element={<Portfolios />} />
                    <Route path={ROUTES.ASSETS} element={<Assets />} />
                    <Route path={ROUTES.NEWS} element={<News />} />
                    <Route path={ROUTES.SETTINGS} element={<Settings />} />
                    <Route path={ROUTES.PRIVACYPOLICY} element={<PrivacyPolicy />} />
                    <Route path={ROUTES.TERMS} element={<TermsOfService />} />
                    <Route path="*" element={<div className="text-xl">404 - Not Found</div>} />
                  </Routes>
                  <Toaster />
                </AppLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
