
import React from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-white dark:bg-primary/5 border border-primary/10 p-4 rounded-xl flex flex-col items-start gap-1 shadow-sm">
      <span className="material-symbols-outlined text-primary mb-1">{icon}</span>
      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-extrabold text-slate-900 dark:text-white leading-none">{value}</p>
    </div>
  );
};

export default StatCard;
