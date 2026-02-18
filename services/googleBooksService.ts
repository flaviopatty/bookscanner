
import { Book } from '../types';

export const googleBooksService = {
    async getBookByIsbn(isbn: string): Promise<Partial<Book> | null> {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
            const data = await response.json();

            if (data.totalItems === 0) return null;

            const item = data.items[0].volumeInfo;

            return {
                title: item.title || '',
                author: item.authors ? item.authors.join(', ') : '',
                publisher: item.publisher || '',
                isbn: isbn,
                pageCount: item.pageCount,
                coverUrl: item.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
            };
        } catch (error) {
            console.error("Erro ao buscar livro na API do Google Books:", error);
            throw error;
        }
    }
};
