
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface ProfileFormProps {
    initialData: UserProfile | null;
    onSave: (data: UserProfile) => void;
    onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        role: initialData?.role || ''
    });
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className={`fixed inset-0 z-[120] bg-white dark:bg-background-dark flex flex-col transition-transform duration-500 ease-out ${isAnimating ? 'translate-y-0' : 'translate-y-full'}`}>
            <header className="flex items-center p-4 border-b border-primary/10">
                <button onClick={onCancel} className="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 text-slate-500">
                    <span className="material-symbols-outlined">close</span>
                </button>
                <h2 className="ml-2 text-xl font-extrabold text-slate-900 dark:text-white">Editar Perfil</h2>
                <button form="profile-form" type="submit" className="ml-auto bg-primary text-white px-6 py-2 rounded-full font-bold shadow-md shadow-primary/20 active:scale-95 transition-transform">
                    Salvar
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
                <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">person</span>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Seu nome"
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-primary/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-transparent rounded-2xl transition-all font-bold text-slate-900 dark:text-white outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Cargo / Função</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">work</span>
                            <input
                                required
                                value={formData.role}
                                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                placeholder="Ex: Bibliotecário"
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-primary/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-transparent rounded-2xl transition-all font-bold text-slate-900 dark:text-white outline-none"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
