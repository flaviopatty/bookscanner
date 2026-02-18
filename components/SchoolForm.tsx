
import React, { useState, useEffect } from 'react';
import { School } from '../types';

interface SchoolFormProps {
    initialData: School | null;
    onSave: (data: Omit<School, 'id'>) => void;
    onCancel: () => void;
}

const SchoolForm: React.FC<SchoolFormProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        address: initialData?.address || '',
        libraryName: initialData?.libraryName || '',
        director: initialData?.director || '',
        substituteDirector: initialData?.substituteDirector || '',
        pedagogicalCoordinator: initialData?.pedagogicalCoordinator || ''
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
                <h2 className="ml-2 text-xl font-extrabold text-slate-900 dark:text-white">Dados da Escola</h2>
                <button form="school-form" type="submit" className="ml-auto bg-primary text-white px-6 py-2 rounded-full font-bold shadow-md shadow-primary/20 active:scale-95 transition-transform">
                    Salvar
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 pb-20">
                <form id="school-form" onSubmit={handleSubmit} className="space-y-6">
                    {initialData?.id && (
                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 mb-4">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Código de Controle</p>
                            <p className="text-lg font-mono font-black text-slate-900 dark:text-white tracking-widest">{initialData.id}</p>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Nome da Escola</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">school</span>
                            <input
                                required
                                readOnly={!!initialData?.id}
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Ex: Escola Municipal Estácio de Sá"
                                className={`w-full h-14 pl-12 pr-4 border-2 border-transparent rounded-2xl transition-all font-bold outline-none ${initialData?.id
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                                        : 'bg-slate-50 dark:bg-primary/5 focus:border-primary/30 focus:bg-white dark:focus:bg-transparent text-slate-900 dark:text-white'
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Endereço</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">location_on</span>
                            <input
                                required
                                value={formData.address}
                                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                placeholder="Rua, Número, Bairro"
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-primary/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-transparent rounded-2xl transition-all font-bold text-slate-900 dark:text-white outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Nome da Biblioteca</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">library_books</span>
                            <input
                                required
                                value={formData.libraryName}
                                onChange={e => setFormData(prev => ({ ...prev, libraryName: e.target.value }))}
                                placeholder="Nome da Biblioteca da Escola"
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-primary/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-transparent rounded-2xl transition-all font-bold text-slate-900 dark:text-white outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Diretor(a)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">person_filled</span>
                                <input
                                    required
                                    value={formData.director}
                                    onChange={e => setFormData(prev => ({ ...prev, director: e.target.value }))}
                                    placeholder="Nome do Diretor"
                                    className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-primary/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-transparent rounded-2xl transition-all font-bold text-slate-900 dark:text-white outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Diretor(a) Substituto(a)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">person</span>
                                <input
                                    required
                                    value={formData.substituteDirector}
                                    onChange={e => setFormData(prev => ({ ...prev, substituteDirector: e.target.value }))}
                                    placeholder="Nome do Diretor Substituto"
                                    className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-primary/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-transparent rounded-2xl transition-all font-bold text-slate-900 dark:text-white outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Coordenador(a) Pedagógico(a)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">groups</span>
                                <input
                                    required
                                    value={formData.pedagogicalCoordinator}
                                    onChange={e => setFormData(prev => ({ ...prev, pedagogicalCoordinator: e.target.value }))}
                                    placeholder="Nome do Coordenador"
                                    className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-primary/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-transparent rounded-2xl transition-all font-bold text-slate-900 dark:text-white outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SchoolForm;
