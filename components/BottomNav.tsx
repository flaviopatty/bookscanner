
import React from 'react';
import { ViewType } from '../types';

interface BottomNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  userRole?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange, userRole }) => {
  const navItems = [
    { id: 'HOME' as ViewType, icon: 'home', label: 'Início' },
    { id: 'LIBRARY' as ViewType, icon: 'menu_book', label: 'Biblioteca' },
    ...(userRole === 'Diretor' ? [{ id: 'INVITE' as ViewType, icon: 'person_add', label: 'Convite' }] : []),
    { id: 'SETTINGS' as ViewType, icon: 'settings', label: 'Ajustes' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t border-primary/10 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-6 pb-6 pt-3 flex items-center justify-around z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentView === item.id ? 'text-primary scale-110' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${currentView === item.id ? 'filled-icon font-variation-fill' : ''}`}>
            {item.icon}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
