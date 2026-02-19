
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
        // Removendo orderBy temporariamente para diagnóstico de índice
        const q = query(collection(db, COLLECTION_NAME));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
        } as Book));
    },

    async addBook(book: Omit<Book, 'id'>): Promise<string> {
        // Limpar campos undefined para evitar erro no Firestore
        const cleanData = Object.entries(book).reduce((acc, [key, value]) => {
            if (value !== undefined) acc[key] = value;
            return acc;
        }, {} as any);

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...cleanData,
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
