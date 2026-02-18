
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeBookCover = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image.split(',')[1] || base64Image,
              },
            },
            {
              text: "Analise a capa deste livro e extraia as seguintes informações: Título, Autor, Editora, ISBN e Quantidade de Páginas. Retorne um objeto JSON válido.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'O título do livro.',
            },
            author: {
              type: Type.STRING,
              description: 'O autor do livro.',
            },
            publisher: {
              type: Type.STRING,
              description: 'A editora do livro.',
            },
            isbn: {
              type: Type.STRING,
              description: 'O ISBN do livro.',
            },
            pageCount: {
              type: Type.NUMBER,
              description: 'A quantidade de páginas do livro (se visível).',
            },
          },
          required: ["title", "author"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    throw error;
  }
};
