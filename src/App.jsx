import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Portfolios from './pages/Portfolios';
import Assets from './pages/Assets';
import News from './pages/News';
import Settings from './pages/Settings';
import { ROUTES } from '@/constants/routes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.PORTFOLIOS} element={<Portfolios />} />
            <Route path={ROUTES.ASSETS} element={<Assets />} />
            <Route path={ROUTES.NEWS} element={<News />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
            <Route path="*" element={<div className="text-xl">404 - Not Found</div>} />
          </Routes>
          <Toaster />
        </AppLayout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
