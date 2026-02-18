
import React, { useState, useEffect } from 'react';
import { googleBooksService } from '../services/googleBooksService';
import BarcodeScanner from './BarcodeScanner';
import { Book } from '../types';

interface ISBNModalProps {
    onBookFound: (book: Partial<Book>) => void;
    onClose: () => void;
}

const ISBNModal: React.FC<ISBNModalProps> = ({ onBookFound, onClose }) => {
    const [isbn, setIsbn] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
    }, []);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (isbn.length < 10) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await googleBooksService.getBookByIsbn(isbn);
            if (result) {
                // Pequeno delay para efeito visual de sucesso
                setTimeout(() => {
                    onBookFound(result);
                }, 600);
            } else {
                setError('Livro não encontrado. Verifique o número.');
            }
        } catch (err) {
            setError('Erro ao buscar livro na API.');
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-search quando atingir o tamanho padrão de ISBN-13
    useEffect(() => {
        const cleanIsbn = isbn.replace(/[- ]/g, '');
        if (cleanIsbn.length === 13) {
            handleSearch();
        }
    }, [isbn]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(onClose, 400);
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-400 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-sm bg-white dark:bg-background-dark rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 ease-out transform ${isAnimating ? 'translate-y-0 scale-100' : 'translate-y-20 scale-95 opacity-0'}`}
            >
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-3xl">barcode</span>
                        </div>
                        <button onClick={handleClose} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-primary/10 text-slate-400 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">Incluir por ISBN</h2>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-8">Digite o número abaixo</p>

                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="relative group flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    autoFocus
                                    type="text"
                                    value={isbn}
                                    onChange={(e) => setIsbn(e.target.value)}
                                    placeholder="9780000000000"
                                    className="w-full h-16 px-6 bg-slate-50 dark:bg-primary/5 border-2 border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-transparent rounded-2xl transition-all font-mono text-xl tracking-widest text-slate-900 dark:text-white outline-none placeholder:text-slate-300"
                                />
                                {isLoading && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <div className="size-6 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowScanner(true)}
                                className="size-16 bg-primary/10 hover:bg-primary/20 text-primary rounded-2xl flex items-center justify-center transition-colors active:scale-95"
                                title="Escanear Código de Barras"
                            >
                                <span className="material-symbols-outlined text-3xl">barcode_scanner</span>
                            </button>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3 animate-shake">
                                <span className="material-symbols-outlined text-red-500 text-xl">error</span>
                                <p className="text-xs font-bold text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <button
                            disabled={isLoading || isbn.length < 10}
                            type="submit"
                            className="w-full h-16 bg-primary disabled:opacity-50 disabled:grayscale text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            {isLoading ? 'Buscando...' : (
                                <>
                                    <span>Buscar Livro</span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        DICA: O ISBN É O CÓDIGO DE 13 DÍGITOS <br /> ATRÁS DO LIVRO.
                    </p>
                </div>
            </div>

            {showScanner && (
                <BarcodeScanner
                    onDetected={(code) => {
                        setIsbn(code);
                        setShowScanner(false);
                    }}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </div>
    );
};

export default ISBNModal;
