
import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { Book } from '../types';

const COLLECTION_NAME = 'books';

export const bookService = {
    // Obter todos os livros
    async getBooks(): Promise<Book[]> {
        const q = query(collection(db, COLLECTION_NAME), orderBy('scannedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
        } as Book));
    },

    // Adicionar um novo livro
    async addBook(book: Omit<Book, 'id'>): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...book,
            createdAt: serverTimestamp(),
        });
        return docRef.id;
    },

    // Deletar um livro
    async deleteBook(id: string): Promise<void> {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    },

    // Alternar favorito
    async toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
        const bookRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(bookRef, {
            isFavorite: !isFavorite
        });
    },

    // Atualizar livro
    async updateBook(id: string, data: Partial<Book>): Promise<void> {
        const bookRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(bookRef, data);
    }
};
