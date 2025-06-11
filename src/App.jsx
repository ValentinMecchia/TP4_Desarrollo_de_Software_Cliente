import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import AppSidebar from '@/components/layout/AppSidebar';
import AppHeader from '@/components/layout/AppHeader';
import { ROUTES } from '@/constants/routes';

// Ejemplo de páginas (puedes reemplazar por tus componentes reales)
function Dashboard() {
  return <div className="text-2xl font-bold">Dashboard</div>;
}
function Portfolios() {
  return <div className="text-2xl font-bold">Portfolios</div>;
}
function Assets() {
  return <div className="text-2xl font-bold">Assets</div>;
}
function News() {
  return <div className="text-2xl font-bold">News & Insights</div>;
}
function Settings() {
  return <div className="text-2xl font-bold">Settings</div>;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="flex min-h-screen bg-background">
          <AppSidebar />
          <div className="flex flex-1 flex-col md:ml-64">
            <AppHeader />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.PORTFOLIOS} element={<Portfolios />} />
                <Route path={ROUTES.ASSETS} element={<Assets />} />
                <Route path={ROUTES.NEWS} element={<News />} />
                <Route path={ROUTES.SETTINGS} element={<Settings />} />
                {/* Puedes agregar más rutas aquí */}
                <Route path="*" element={<div className="text-xl">404 - Not Found</div>} />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
