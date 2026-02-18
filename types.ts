
export interface Book {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  isbn?: string;
  scannedAt: string;
  coverUrl: string;
  pageCount?: number;
  isFavorite?: boolean;
}

export interface ScanStat {
  day: string;
  count: number;
  date?: string;
}

export type ViewType = 'HOME' | 'LIBRARY' | 'SCAN' | 'STATS' | 'SETTINGS' | 'INVITE' | 'STUDENT_HOME';

export interface UserProfile {
  name: string;
  email: string;
  role: 'Diretor' | 'Funcionário' | 'Aluno';
  schoolId?: string;
  mustChangePassword?: boolean;
}

export interface School {
  id: string;
  name: string;
  address: string;
  libraryName: string;
  director: string;
  substituteDirector: string;
  pedagogicalCoordinator: string;
}

export interface Invitation {
  id: string;
  name: string;
  email: string;
  role: UserProfile['role'];
  status: 'pending' | 'accepted';
  deliveryStatus?: 'SUCCESS' | 'ERROR' | 'PENDING';
  createdAt: string;
  schoolId: string;
}
