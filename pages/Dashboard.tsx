
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from 'recharts';
import { SCAN_STATS } from '../constants';
import StatCard from '../components/StatCard';
import ISBNModal from '../components/ISBNModal';
import { Book, ViewType } from '../types';

interface DashboardProps {
  books: Book[];
  onViewChange: (view: ViewType) => void;
  onBookFound: (book: Partial<Book>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ books, onViewChange, onBookFound }) => {
  const [showISBNModal, setShowISBNModal] = React.useState(false);

  // Calcular estatísticas reais dos últimos 10 dias
  const stats = React.useMemo(() => {
    const last10Days = Array.from({ length: 10 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (9 - i));
      return {
        day: d.toLocaleDateString('pt-BR', { day: '2-digit' }),
        fullDate: d.toISOString().split('T')[0],
        count: 0
      };
    });

    books.forEach(book => {
      const bookDate = book.scannedAt;
      const statIndex = last10Days.findIndex(s => s.fullDate === bookDate);
      if (statIndex !== -1) {
        last10Days[statIndex].count++;
      }
    });

    return last10Days;
  }, [books]);

  const latestScans = stats[stats.length - 1].count;

  // Calcular média diária (total de livros / dias desde o primeiro registro ou total de dias ativos)
  const dailyAverage = React.useMemo(() => {
    if (books.length === 0) return 0;

    const dates = books.map(b => new Date(b.scannedAt).getTime());
    const minDate = Math.min(...dates);
    const maxDate = new Date().getTime();

    const diffTime = Math.abs(maxDate - minDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    return (books.length / diffDays).toFixed(1);
  }, [books]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sticky top-0 z-10 bg-white dark:bg-background-dark">
        <div className="text-primary flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <span className="material-symbols-outlined">menu</span>
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">BookScanner</h1>
        <button className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Capturas de Livros</h2>
          <p className="text-primary font-bold text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            Últimos 10 Dias
          </p>
        </div>

        {/* Chart Card */}
        <div className="bg-background-light dark:bg-primary/5 rounded-2xl p-6 border border-primary/10 shadow-sm mb-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Escaneamentos Diários</p>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {latestScans} <span className="text-lg font-bold text-slate-400">livros</span>
              </p>
            </div>
            <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-sm">trending_up</span>
              <span className="text-green-600 dark:text-green-400 text-xs font-bold">Hoje</span>
            </div>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === stats.length - 1 ? '#11c4d4' : '#11c4d433'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard icon="auto_stories" label="Total de Livros" value={books.length} />
          <StatCard icon="analytics" label="Média Diária" value={dailyAverage} />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Incluir livro</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowISBNModal(true)}
                className="bg-white dark:bg-primary/5 border-2 border-primary/20 hover:border-primary/40 text-slate-900 dark:text-white font-bold py-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-2xl text-primary">barcode</span>
                <span className="text-sm">Por ISBN</span>
              </button>

              <button
                onClick={() => onViewChange('SCAN')}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-2xl">camera</span>
                <span className="text-sm">Escanear capa</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => onViewChange('LIBRARY')}
            className="w-full bg-white dark:bg-transparent border-2 border-primary/20 text-slate-900 dark:text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-primary/5 active:scale-95 mt-2"
          >
            <span className="material-symbols-outlined text-2xl text-primary">library_books</span>
            <span className="text-lg">Minha Biblioteca</span>
          </button>
        </div>
      </main>

      {showISBNModal && (
        <ISBNModal
          onClose={() => setShowISBNModal(false)}
          onBookFound={(book) => {
            setShowISBNModal(false);
            onBookFound(book);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
