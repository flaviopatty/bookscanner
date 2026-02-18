
import React, { useState, useEffect } from 'react';
import { Book } from '../types';

interface BookFormProps {
    initialData?: Partial<Book>;
    onSave: (book: Book) => void;
    onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        author: initialData?.author || '',
        publisher: initialData?.publisher || '',
        isbn: initialData?.isbn || '',
        coverUrl: initialData?.coverUrl || '',
        pageCount: initialData?.pageCount ? String(initialData.pageCount) : '',
    });

    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newBook: Book = {
            id: initialData?.id || Date.now().toString(),
            title: formData.title,
            author: formData.author,
            publisher: formData.publisher,
            isbn: formData.isbn,
            coverUrl: formData.coverUrl,
            pageCount: formData.pageCount ? Number(formData.pageCount) : undefined,
            scannedAt: initialData?.scannedAt || new Date().toISOString().split('T')[0],
            isFavorite: initialData?.isFavorite || false,
        };
        onSave(newBook);
    };

    return (
        <div className={`fixed inset-0 z-[110] bg-white dark:bg-background-dark flex flex-col transition-transform duration-500 ease-out ${isAnimating ? 'translate-y-0' : 'translate-y-full'}`}>
            <header className="flex items-center p-4 border-b border-primary/10">
                <button
                    onClick={onCancel}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 text-slate-500"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
                <h2 className="ml-2 text-xl font-extrabold text-slate-900 dark:text-white">
                    {initialData?.title ? 'Editar Detalhes' : 'Confirmar Detalhes'}
                </h2>
                <button
                    form="book-form"
                    type="submit"
                    className="ml-auto bg-primary text-white px-6 py-2 rounded-full font-bold shadow-md shadow-primary/20 active:scale-95 transition-transform"
                >
                    Salvar
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex justify-center mb-8">
                    <div className="relative w-32 aspect-[3/4] bg-slate-100 dark:bg-primary/5 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 ring-1 ring-primary/20">
                        {formData.coverUrl ? (
                            <img src={formData.coverUrl} alt="Capa" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                <span className="material-symbols-outlined text-4xl">image</span>
                                <p className="text-[10px] font-bold mt-1 uppercase">Sem Capa</p>
                            </div>
                        )}
                        <button className="absolute bottom-2 right-2 size-8 bg-primary rounded-full text-white flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                    </div>
                </div>

                <form id="book-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Título do Livro</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">title</span>
                            <input
                                required
                                value={formData.title}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Ex: O Pequeno Príncipe"
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-primary/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-transparent rounded-2xl transition-all font-bold text-slate-900 dark:text-white outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Autor</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">person</span>
                            <input
                                required
                                value={formData.author}
                                onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                placeholder="Ex: Antoine de Saint-Exupéry"
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-primary/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-transparent rounded-2xl transition-all font-bold text-slate-900 dark:text-white outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Editora</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">apartment</span>
                                <input
                                    value={formData.publisher}
                                    onChange={e => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
                                    placeholder="Nome da Editora"
                                    className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-primary/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-transparent rounded-2xl transition-all font-bold text-slate-900 dark:text-white outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">ISBN</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">barcode</span>
                                <input
                                    value={formData.isbn}
                                    onChange={e => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
                                    placeholder="978-0..."
                                    className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-primary/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-transparent rounded-2xl transition-all font-bold text-slate-900 dark:text-white outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Link da Capa (URL)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">link</span>
                            <input
                                value={formData.coverUrl}
                                onChange={e => setFormData(prev => ({ ...prev, coverUrl: e.target.value }))}
                                placeholder="https://exemplo.com/capa.jpg"
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-primary/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-transparent rounded-2xl transition-all font-bold text-slate-900 dark:text-white outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Quantidade de Páginas</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-xl">auto_stories</span>
                            <input
                                type="number"
                                value={formData.pageCount}
                                onChange={e => setFormData(prev => ({ ...prev, pageCount: e.target.value }))}
                                placeholder="Ex: 320"
                                className="w-full h-14 pl-12 pr-4 bg-slate-50 dark:bg-primary/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-transparent rounded-2xl transition-all font-bold text-slate-900 dark:text-white outline-none"
                            />
                        </div>
                    </div>

                    {(!initialData?.id || isNaN(Number(initialData.id))) && (
                        <div className="pt-4">
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-4">
                                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Preenchido por IA</p>
                                    <p className="text-[11px] text-slate-500 leading-tight">Os dados acima foram extraídos da foto usando Inteligência Artificial. Verifique se estão corretos antes de salvar.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default BookForm;
