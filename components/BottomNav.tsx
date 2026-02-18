
import React from 'react';
import { ViewType } from '../types';

interface BottomNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'HOME' as ViewType, icon: 'home', label: 'Início' },
    { id: 'LIBRARY' as ViewType, icon: 'menu_book', label: 'Biblioteca' },
    { id: 'SETTINGS' as ViewType, icon: 'settings', label: 'Ajustes' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t border-primary/10 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-6 pb-6 pt-3 flex items-center justify-between z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === item.id ? 'text-primary' : 'text-slate-400'
            }`}
        >
          <span className={`material-symbols-outlined ${currentView === item.id ? 'filled-icon' : ''}`}>
            {item.icon}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
