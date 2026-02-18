
import React, { useState } from 'react';
import { UserProfile, Invitation } from '../types';

interface InviteProps {
    onInvite: (data: { name: string, email: string, role: UserProfile['role'] }) => Promise<void>;
    onCancel: () => void;
    sentInvites?: Invitation[];
}

const Invite: React.FC<InviteProps> = ({ onInvite, onCancel, sentInvites = [] }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserProfile['role']>('Aluno');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        setIsSubmitting(true);
        try {
            await onInvite({ name, email, role });
            setName('');
            setEmail('');
            setRole('Aluno');
        } catch (error) {
            console.error('Erro ao enviar convite:', error);
            alert('Ocorreu um erro ao enviar o convite.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 pb-32">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white leading-tight">
                    Convidar <span className="text-primary">Membro</span>
                </h1>
                <p className="text-slate-500 font-medium mt-2">
                    Adicione novos membros à sua escola.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 mb-12">
                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">
                        Nome Completo
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            person
                        </span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-primary/5 border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-slate-700 dark:text-white"
                            placeholder="Ex: João Silva"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">
                        E-mail
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            mail
                        </span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-primary/5 border-2 border-transparent focus:border-primary/20 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-slate-700 dark:text-white"
                            placeholder="exemplo@email.com"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">
                        Regra de Acesso
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                        {(['Diretor', 'Funcionário', 'Aluno'] as const).map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${role === r
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-transparent bg-slate-100 dark:bg-primary/5 text-slate-500'
                                    }`}
                            >
                                <span className="material-symbols-outlined">
                                    {r === 'Diretor' ? 'admin_panel_settings' : r === 'Funcionário' ? 'badge' : 'person'}
                                </span>
                                <span className="font-bold">{r}</span>
                                {role === r && (
                                    <span className="material-symbols-outlined ml-auto">check_circle</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4 space-y-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">send</span>
                                ENVIAR CONVITE
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                    >
                        VOLTAR PARA O INÍCIO
                    </button>
                </div>
            </form>

            {/* List of Sent Invites */}
            {sentInvites.length > 0 && (
                <div className="mt-12 space-y-6">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                        Convites <span className="text-primary italic">Enviados</span>
                    </h2>
                    <div className="space-y-3">
                        {sentInvites.map((invite) => (
                            <div key={invite.id} className="bg-white dark:bg-primary/5 p-4 rounded-3xl border border-primary/10 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-black text-slate-700 dark:text-white text-sm tracking-tight">{invite.name}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{invite.email}</span>
                                    <div className="flex gap-2 mt-1 items-center">
                                        <span className="text-[9px] font-black bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded text-slate-500 uppercase tracking-widest">{invite.role}</span>
                                        {invite.deliveryStatus === 'SUCCESS' && (
                                            <span className="flex items-center gap-0.5 text-[8px] font-bold text-emerald-500 uppercase">
                                                <span className="material-symbols-outlined text-[10px]">mail</span> Enviado
                                            </span>
                                        )}
                                        {invite.deliveryStatus === 'ERROR' && (
                                            <span className="flex items-center gap-0.5 text-[8px] font-bold text-red-500 uppercase">
                                                <span className="material-symbols-outlined text-[10px]">error</span> Erro e-mail
                                            </span>
                                        )}
                                        {invite.deliveryStatus === 'PENDING' && (
                                            <span className="flex items-center gap-0.5 text-[8px] font-bold text-amber-500 uppercase">
                                                <span className="material-symbols-outlined text-[10px] animate-pulse">hourglass_empty</span> Processando
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${invite.status === 'accepted' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-500'}`}>
                                    <span className={`material-symbols-outlined text-sm ${invite.status === 'accepted' ? 'filled-icon' : ''}`}>
                                        {invite.status === 'accepted' ? 'check_circle' : 'pending'}
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-widest">
                                        {invite.status === 'accepted' ? 'Acessou' : 'Pendente'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-900/30">
                <div className="flex gap-3">
                    <span className="material-symbols-outlined text-amber-500">info</span>
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
                        O convidado receberá um e-mail com uma senha provisória que deverá ser alterada no primeiro acesso ao sistema.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Invite;
