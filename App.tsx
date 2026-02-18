
import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Scanner from './pages/Scanner';
import BookForm from './components/BookForm';
import ProfileForm from './components/ProfileForm';
import SchoolForm from './components/SchoolForm';
import Invite from './pages/Invite';
import StudentDashboard from './pages/StudentDashboard';
import BottomNav from './components/BottomNav';
import { Book, ViewType, UserProfile, School } from './types';
import { INITIAL_BOOKS } from './constants';
import { bookService } from './services/bookService';
import { schoolService } from './services/schoolService';
import { authService } from './services/authService';
import AuthView from './pages/AuthView';
import { User } from 'firebase/auth';
import { useEffect } from 'react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('HOME');
  const [books, setBooks] = useState<Book[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedBook, setScannedBook] = useState<Partial<Book> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Settings State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = authService.subscribe(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchData(currentUser.uid);
      } else {
        setBooks([]);
        setUserProfile(null);
        setSchool(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchData = async (uid: string) => {
    setIsLoading(true);
    try {
      const [booksData, profileData, schoolData] = await Promise.all([
        bookService.getBooks(), // Note: In a real app, these should pass uid or be gated by security rules
        authService.getUserProfile(uid),
        schoolService.getSchool()
      ]);
      setBooks(booksData);
      setUserProfile(profileData);
      setSchool(schoolData);

      // Direcionar Aluno para sua página exclusiva
      if (profileData?.role === 'Aluno') {
        setCurrentView('STUDENT_HOME');
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("Deseja realmente sair?")) {
      await authService.logout();
      setCurrentView('HOME');
    }
  };

  const handleSaveProfile = async (profile: UserProfile) => {
    try {
      await schoolService.saveUserProfile(profile);
      setUserProfile(profile);
      setShowProfileModal(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar perfil.");
    }
  };

  const handleSaveSchool = async (schoolData: Omit<School, 'id'>) => {
    try {
      const id = await schoolService.saveSchool(schoolData, school?.id);
      setSchool({ ...schoolData, id });
      setShowSchoolModal(false);
    } catch (error) {
      console.error("Erro ao salvar escola:", error);
      alert("Erro ao salvar escola.");
    }
  };

  const handleBookScanned = (book: Book) => {
    setScannedBook(book);
    setShowScanner(false);
  };

  const handleSaveBook = async (book: Book) => {
    try {
      // Verificar se é uma edição (ID já existe no banco/lista)
      const existingBook = books.find(b => b.id === book.id);

      if (existingBook) {
        const { id, ...bookData } = book;
        await bookService.updateBook(id, bookData);
        setBooks(prev => prev.map(b => b.id === id ? book : b));
      } else {
        // Remover o ID temporário gerado no Scanner para o Firebase gerar o seu
        const { id, ...bookData } = book;
        const newId = await bookService.addBook(bookData);
        const savedBook = { ...book, id: newId };
        setBooks(prev => [savedBook, ...prev]);
      }

      setScannedBook(null);
      setCurrentView('LIBRARY');
    } catch (error) {
      console.error("Erro ao salvar livro no Firebase:", error);
      alert("Erro ao salvar livro. Verifique as configurações do Firestore.");
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await bookService.deleteBook(id);
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
    }
  };

  const handleToggleFavorite = async (book: Book) => {
    try {
      await bookService.toggleFavorite(book.id, !!book.isFavorite);
      setBooks(prev => prev.map(b => b.id === book.id ? { ...b, isFavorite: !b.isFavorite } : b));
    } catch (error) {
      console.error("Erro ao favoritar livro:", error);
    }
  };

  const handleViewChange = (view: ViewType) => {
    if (view === 'SCAN') {
      setShowScanner(true);
    } else {
      setCurrentView(view);
      setShowScanner(false);
    }
  };

  const handleInvite = async (inviteData: { name: string, email: string, role: UserProfile['role'] }) => {
    if (!school?.id) {
      alert("Você precisa cadastrar sua escola antes de convidar alguém.");
      return;
    }

    try {
      const tempPassword = await schoolService.inviteUser({
        ...inviteData,
        schoolId: school.id
      });
      alert(`Convite enviado com sucesso para ${inviteData.email}!\nSenha Provisória: ${tempPassword}`);
      setCurrentView('HOME');
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      alert("Erro ao enviar convite.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark font-sans selection:bg-primary/20">
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative bg-white dark:bg-background-dark shadow-2xl overflow-x-hidden">

        {/* Page Content */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Verificando sessão...</p>
            </div>
          ) : !user ? (
            <AuthView onAuthSuccess={() => { }} />
          ) : (
            <>
              {currentView === 'HOME' && (
                <Dashboard
                  books={books}
                  onViewChange={handleViewChange}
                  onBookFound={(book) => setScannedBook(book)}
                />
              )}
              {currentView === 'LIBRARY' && (
                <Library
                  books={books}
                  onViewChange={handleViewChange}
                  onEditBook={(book) => setScannedBook(book)}
                  onDeleteBook={handleDeleteBook}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
              {currentView === 'STUDENT_HOME' && (
                <StudentDashboard
                  bookCount={books.length}
                  onLogout={handleLogout}
                />
              )}
            </>
          )}
          {currentView === 'INVITE' && userProfile?.role === 'Diretor' && (
            <Invite
              onInvite={handleInvite}
              onCancel={() => setCurrentView('HOME')}
            />
          )}
          {currentView === 'SETTINGS' && (
            <div className="p-8">
              <h1 className="text-2xl font-extrabold mb-6">Ajustes</h1>
              <div className="space-y-4">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-primary/5 rounded-2xl border border-primary/5 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">person</span>
                    <div className="text-left">
                      <div className="font-bold text-slate-700 dark:text-slate-200">Perfil</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{userProfile?.role || 'Usuário'}</div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </button>

                {userProfile?.role === 'Diretor' && (
                  <button
                    onClick={() => setShowSchoolModal(true)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-primary/5 rounded-2xl border border-primary/5 hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">school</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">Dados da Escola</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                  </button>
                )}

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowAbout(!showAbout)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-primary/5 rounded-2xl border border-primary/5 hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">info</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">Sobre o BookScanner</span>
                    </div>
                    <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${showAbout ? 'rotate-90' : ''}`}>chevron_right</span>
                  </button>

                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showAbout ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-6 bg-primary/5 rounded-[24px] border border-primary/10 mx-2">
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-bold italic">
                        "Aplicativo desenvolvido por Flavio Azevedo, durante o verão escaldante de fevereiro 2026, em uma depedência de apartamento e sendo refrescado por um combalido ventilador."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-primary/5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-4 text-red-500 font-black uppercase tracking-widest text-[11px] hover:bg-red-50 dark:hover:bg-red-500/5 rounded-2xl transition-colors"
                  >
                    <span className="material-symbols-outlined font-variation-fill">logout</span>
                    Sair da Conta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Components */}
        {showScanner && (
          <Scanner
            onBookScanned={handleBookScanned}
            onClose={() => setShowScanner(false)}
          />
        )}

        {scannedBook && (
          <BookForm
            initialData={scannedBook}
            onSave={handleSaveBook}
            onCancel={() => setScannedBook(null)}
          />
        )}

        {showProfileModal && (
          <ProfileForm
            initialData={userProfile}
            onSave={handleSaveProfile}
            onCancel={() => setShowProfileModal(false)}
          />
        )}

        {showSchoolModal && (
          <SchoolForm
            initialData={school}
            onSave={handleSaveSchool}
            onCancel={() => setShowSchoolModal(false)}
          />
        )}

        {user && userProfile?.role !== 'Aluno' && (
          <BottomNav
            currentView={currentView}
            onViewChange={handleViewChange}
            userRole={userProfile?.role}
          />
        )}
      </div>
    </div >
  );
};

export default App;
