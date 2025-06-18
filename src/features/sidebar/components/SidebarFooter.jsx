import React from 'react';

export const SidebarFooter = () => {
  return (
    <div className="p-4 text-xs text-[var(--text-secondary)] border-t border-[var(--border)]">
      <div className="flex items-center justify-between">
        <span>Total Notes</span>
        <span className="text-[var(--text-primary)]">0</span>
      </div>
    </div>
  );
}; 