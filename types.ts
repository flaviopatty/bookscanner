
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

export type ViewType = 'HOME' | 'LIBRARY' | 'SCAN' | 'STATS' | 'SETTINGS';

export interface UserProfile {
  name: string;
  role: string;
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
