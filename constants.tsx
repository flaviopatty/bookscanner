
import { Book, ScanStat } from './types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    scannedAt: '2023-10-12',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVuGnFHGtwQfIRFkub0aB9C3gACAUgN6nJDrrg0Vvxf7lx8xwhywZDLjyOR8B0d_ZUkUxbw8AJ4AFJK0D_T96623Pi9KmHaf5w-7IdkIMUZrMQQIJ9JoKjZHNuIbVPxo2pAJVdawpvoMMwO4R3W7Xe7RNdtHhVstlr_h9bg1QyCDUiaj5BJ_nCiuZZooHahR6qZ1o0RlYoOWVFMqgUnPHKDryCCggxEDCACUPUOVXwk4n7HEIsMQzGSHEbWAbYtD0uZYuCejtvXnY',
    isFavorite: true
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    scannedAt: '2023-10-10',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxBb6Dbg_P9TX-8oHeCzMTEmonrxTwhNZUqpVDR3nLRW01SNYR3EJFsyF5jfSHZn1GbH3K-_XcSk90EY19-JMqDZw4m-Ym_GJVKLJ6xt50PJjYKiFHlfYV_z936fu4UnvXZl0i2nXKjnAGULX-QH0d7E3Q8sBrED-IMi15ElodnbfgggAPQFYDsuN4R7TwnvorSAgUeCU7fxUTjnV9sDM4d1B2DNdy3dqcsD-8TAs3b45pShgzJenZXykMZ81WzZUuLgHjC_oPKFk',
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    scannedAt: '2023-09-28',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_keTcLwCtbEPG2t32HFZhcs_g9iZ4Z6e6npj3eRDOTZ3-zsj8aHsvjrSyUFXLgFTjdCHfpWxZY2XQFoZHp6Bfq_J8vjTSNIFq2lqkdX3nNhnaWhiomwmKunsQkFEZ29OjL7BuogfTbPJWnoYkEirmPsHtfXWxkjarWGcE9zNEdJYea4kmrgT1DfNmHqsSk-7Rtq0VYzM-JFHIYZ7jOHmBP2vgUMLFm_m1J0MezXGjICqxdMCW3dVonoO6sv2aH1MItmFiBvFq3SU',
  },
  {
    id: '4',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    scannedAt: '2023-09-15',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD81J7vs2B8EnvyjBMOkePoRkEuJdTlvmmAxkqKL97ZSt164Ad6mLX6rz0Dbxgj_gBFwTkGQDxpr4WQzMrlF1V9cDL7bSGmBi5HIc-hR_YkJH5fKYfBSqG_f1zJTs8G51mC6Gy7fO0ombJZgQNO7sauarx-BDuSbnqjD5DCEPgbrpAL5AnjS9Cw2Wr1dKO6mGxG6BuqW8J6S4RNF-zfXBS5xvhLEO6Bbe_1nkzEegmE1thWdHfsOFth39EH7iPvsNs-v9oBwWFgGUg',
  }
];

export const SCAN_STATS: ScanStat[] = [
  { day: '01', count: 4 },
  { day: '02', count: 3 },
  { day: '03', count: 6 },
  { day: '04', count: 14 },
  { day: '05', count: 4 },
  { day: '06', count: 2 },
  { day: '07', count: 7 },
  { day: '08', count: 5 },
  { day: '09', count: 9 },
  { day: '10', count: 12 },
];
