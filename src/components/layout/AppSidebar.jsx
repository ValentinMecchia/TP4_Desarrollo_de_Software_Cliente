import React, { useState } from 'react';
import AppSidebarContent from './AppSidebarContent';

export default function AppSidebar() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded shadow block flex flex-col justify-center items-center w-10 h-10"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar Sidebar' : 'Mostrar Sidebar'}
      >
        {/* Icono de menú hamburguesa */}
        <span className="block w-6 h-0.5 bg-white mb-1"></span>
        <span className="block w-6 h-0.5 bg-white mb-1"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </button>
      <aside
        className={`
          fixed top-0 left-0 h-full md:w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border z-40
          transition-transform duration-300 ease-in-out
          ${visible ? 'translate-x-0' : '-translate-x-full'}
          hidden md:flex md:flex-col
        `}
        style={{ willChange: 'transform' }}
      >
        <AppSidebarContent />
      </aside>
    </>
  );
}