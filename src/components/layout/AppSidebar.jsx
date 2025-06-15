import React, { useState } from 'react';
import AppSidebarContent from './AppSidebarContent';

export default function AppSidebar() {
  const [visible, setVisible] = useState(true);

  return (
    <>
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