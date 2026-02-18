
import React, { useState } from 'react';
import { authService } from '../services/authService';

interface AuthViewProps {
    onAuthSuccess: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                await authService.login(email, password);
            } else {
                if (!name) throw new Error("Nome é obrigatório");
                await authService.register(name, email, password);
            }
            onAuthSuccess();
        } catch (err: any) {
            console.error("Erro na autenticação:", err);
            setError(err.message || "Ocorreu um erro inesperado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent">

            {/* Logo Section */}
            <div className="mb-12 text-center">
                <div className="size-20 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                    <span className="material-symbols-outlined text-4xl text-primary filled-icon">auto_stories</span>
                </div>
                <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">
                    BookScanner <span className="text-primary italic">Pro</span>
                </h1>
                <p className="text-slate-400 font-bold uppercase tracking-[4px] text-[10px] mt-2">AI powered cataloging</p>
            </div>

            {/* Card */}
            <div className="w-full max-w-sm bg-white dark:bg-primary/5 p-8 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-primary/10 backdrop-blur-sm">
                <div className="flex gap-4 mb-8 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isLogin ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-lg' : 'text-slate-400'}`}
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${!isLogin ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-lg' : 'text-slate-400'}`}
                    >
                        Criar Conta
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">person</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Como quer ser chamado?"
                                    className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-slate-700 dark:text-white transition-all"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">mail</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-slate-700 dark:text-white transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Senha</label>
                            {isLogin && <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest">Esqueci</button>}
                        </div>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">lock</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/30 rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-slate-700 dark:text-white transition-all"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl">
                            <p className="text-[10px] font-bold text-red-500 text-center uppercase tracking-wider">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-[#11c4d4]/90 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4"
                    >
                        {loading ? (
                            <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span className="font-black tracking-[2px] uppercase">{isLogin ? 'Acessar' : 'Cadastrar'}</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-400 text-[10px] font-black uppercase tracking-[2px]">
                    {isLogin ? "Não tem uma conta?" : "Já possui conta?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary ml-2 hover:underline"
                    >
                        {isLogin ? "Registrar" : "Entrar"}
                    </button>
                </p>
            </div>

            {/* Bottom Info */}
            <div className="mt-12 opacity-30 flex items-center gap-2">
                <span className="material-symbols-outlined text-[10px]">lock</span>
                <p className="text-[9px] font-black uppercase tracking-widest">End-to-end encrypted protocol</p>
            </div>
        </div>
    );
};

export default AuthView;
