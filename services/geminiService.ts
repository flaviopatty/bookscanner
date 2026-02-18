
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// A chave API é injetada pelo Vite via process.env.API_KEY conforme vite.config.ts
const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');

export const analyzeBookCover = async (base64Image: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            title: {
              type: SchemaType.STRING,
              description: 'O título do livro.',
            },
            author: {
              type: SchemaType.STRING,
              description: 'O autor do livro.',
            },
            publisher: {
              type: SchemaType.STRING,
              description: 'A editora do livro.',
            },
            isbn: {
              type: SchemaType.STRING,
              description: 'O ISBN do livro (se visível).',
            },
            pageCount: {
              type: SchemaType.NUMBER,
              description: 'A quantidade de páginas do livro (se visível).',
            },
          },
          required: ["title", "author"],
        },
      },
    });

    const imageData = base64Image.split(',')[1] || base64Image;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData
        }
      },
      {
        text: "Analise a capa deste livro e extraia as seguintes informações: Título, Autor, Editora, ISBN e Quantidade de Páginas. Se o ISBN não estiver na capa mas você reconhecer o livro, pode incluir. Retorne apenas o JSON."
      }
    ]);

    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Erro detalhado na API Gemini:", error);
    throw error;
  }
};

