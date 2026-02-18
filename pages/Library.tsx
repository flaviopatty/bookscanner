
import React, { useState } from 'react';
import { Book, ViewType } from '../types';

interface LibraryProps {
  books: Book[];
  onViewChange: (view: ViewType) => void;
  onEditBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  onToggleFavorite: (book: Book) => void;
}

const Library: React.FC<LibraryProps> = ({ books, onViewChange, onEditBook, onDeleteBook, onToggleFavorite }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos os Livros');

  const filteredBooks = books.filter(book =>
    (book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())) &&
    (activeFilter === 'Todos os Livros' || (activeFilter === 'Favoritos' && book.isFavorite))
  );

  return (
    <div className="flex flex-col min-h-full pb-24">
      {/* ... header and filters ... */}
      <header className="sticky top-0 z-10 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 border-b border-primary/10">
        <button
          onClick={() => onViewChange('HOME')}
          className="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 text-primary transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="ml-2 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Biblioteca</h1>
        <div className="ml-auto flex gap-2">
          <button className="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 text-slate-500">
            <span className="material-symbols-outlined">download</span>
          </button>
          <button className="flex size-10 items-center justify-center rounded-full hover:bg-primary/10 text-slate-500">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-4 bg-white dark:bg-background-dark">
        <label className="relative flex items-center group">
          <div className="absolute left-4 text-slate-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-primary/5 border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-base font-bold placeholder:text-slate-400 placeholder:font-medium"
            placeholder="Pesquisar por título ou autor"
            type="text"
          />
        </label>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
        {['Todos os Livros', 'Recentes', 'Favoritos'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${activeFilter === filter
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-slate-100 dark:bg-primary/10 text-slate-500 border border-transparent'
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Book List */}
      <main className="flex-1 px-4 space-y-4">
        {filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <span className="material-symbols-outlined text-6xl mb-4 text-slate-300">import_contacts</span>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nenhum livro encontrado</p>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="flex items-center gap-4 p-3 bg-white dark:bg-primary/5 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => onEditBook(book)}
            >
              <div className="relative shrink-0 w-[60px] h-[85px] rounded-lg overflow-hidden shadow-sm bg-slate-100">
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col min-w-0">
                <h3 className="text-slate-900 dark:text-white text-base font-bold truncate group-hover:text-primary transition-colors">
                  {book.title}
                </h3>
                <p className="text-primary text-sm font-bold truncate">{book.author}</p>
                <div className="flex items-center gap-1 mt-1 text-slate-400">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest">
                    {new Date(book.scannedAt).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(book);
                  }}
                  className={`size-8 flex items-center justify-center rounded-full transition-colors ${book.isFavorite ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50'}`}
                >
                  <span className={`material-symbols-outlined ${book.isFavorite ? 'filled-icon' : ''}`}>star</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Deseja excluir este livro?')) onDeleteBook(book.id);
                  }}
                  className="size-8 flex items-center justify-center rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => onViewChange('SCAN')}
        className="fixed bottom-24 right-6 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-transform z-20"
      >
        <span className="material-symbols-outlined text-3xl">add_a_photo</span>
      </button>
    </div>
  );
};

export default Library;
