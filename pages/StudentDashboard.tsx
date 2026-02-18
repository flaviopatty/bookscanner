
import React from 'react';

interface StudentDashboardProps {
    bookCount: number;
    onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ bookCount, onLogout }) => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col p-8 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
            {/* Header */}
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                        Olá, <span className="text-primary italic">Aluno</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 mt-1">Bem-vindo à sua biblioteca</p>
                </div>
                <button
                    onClick={onLogout}
                    className="size-12 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center border border-primary/10 text-slate-400 hover:text-red-500 transition-colors shadow-lg shadow-primary/5"
                >
                    <span className="material-symbols-outlined font-variation-fill">logout</span>
                </button>
            </header>

            {/* Main Stats Card */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="w-full bg-white dark:bg-primary/5 p-10 rounded-[3rem] border border-primary/10 shadow-2xl shadow-primary/5 relative overflow-hidden group transition-all hover:scale-[1.02]">
                    <div className="absolute -right-10 -top-10 size-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>

                    <div className="relative z-10 text-center space-y-4">
                        <div className="size-20 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl text-primary filled-icon">menu_book</span>
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-[4px] text-slate-400">Total de Acervo</h2>
                        <div className="text-7xl font-black text-slate-800 dark:text-white tracking-tighter">
                            {bookCount}
                        </div>
                        <p className="text-slate-500 font-bold">Livros cadastrados no sistema</p>
                    </div>
                </div>

                {/* External Link Card */}
                <a
                    href="#"
                    className="w-full bg-primary p-6 rounded-[2rem] shadow-xl shadow-primary/30 flex items-center justify-between group active:scale-[0.98] transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-white">language</span>
                        </div>
                        <div>
                            <h3 className="text-white font-black uppercase tracking-wider text-xs">Sistema da Escola</h3>
                            <p className="text-white/70 text-[10px] font-bold">Acessar biblioteca completa</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-white group-hover:translate-x-2 transition-transform">arrow_forward_ios</span>
                </a>
            </div>

            {/* Footer decoration */}
            <div className="mt-12 text-center opacity-20">
                <div className="flex justify-center gap-2 mb-4">
                    <div className="size-1.5 bg-primary rounded-full"></div>
                    <div className="size-1.5 bg-primary/50 rounded-full"></div>
                    <div className="size-1.5 bg-primary/20 rounded-full"></div>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[5px] text-slate-500">BookScanner Pro AI</p>
            </div>
        </div>
    );
};

export default StudentDashboard;
