import React from 'react';
import { useSidebar } from './hooks/useSidebar';
import { SidebarHeader } from './components/SidebarHeader';
import { NotesList } from './components/NotesList';
import { SidebarFooter } from './components/SidebarFooter';

export const Sidebar = () => {
  const sidebarProps = useSidebar();

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {sidebarProps.isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 sm:hidden"
          onClick={sidebarProps.onMobileClose}
          aria-hidden="true"
        ></div>
      )}
      <aside
        className={`
          bg-[var(--bg-secondary)] border-[var(--border)] font-mono flex flex-col shadow-none 
          fixed inset-y-0 right-0 z-40 w-4/5 max-w-[280px] 
          transform transition-transform duration-300 ease-in-out
          ${sidebarProps.isMobileOpen ? 'translate-x-0' : 'translate-x-full'}
          border-l 
          sm:relative sm:left-auto sm:right-auto sm:translate-x-0 sm:w-60 sm:max-w-none
          sm:rounded-lg 
          sm:border-l-0 sm:border-b-0 sm:border-r 
          ${sidebarProps.isMobileOpen ? 'flex' : 'hidden'} sm:flex
        `}
      >
        <SidebarHeader 
          onAdd={sidebarProps.onAdd}
          isMobileOpen={sidebarProps.isMobileOpen}
          onMobileClose={sidebarProps.onMobileClose}
        />
        <NotesList 
          notes={sidebarProps.notes}
          selectedId={sidebarProps.selectedId}
          onSelect={sidebarProps.onSelect}
          searchQuery={sidebarProps.searchQuery}
        />
        <SidebarFooter />
      </aside>
    </>
  );
}; 