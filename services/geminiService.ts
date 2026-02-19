import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeBookCover = async (base64Image: string) => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';

  if (!apiKey) {
    console.error("ERRO: Gemini API Key não encontrada.");
    throw new Error("API Key ausente. Configure GEMINI_API_KEY no seu arquivo .env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const imageData = base64Image.split(',')[1] || base64Image;

  // Log de diagnóstico (seguro: mostra apenas os 4 primeiros caracteres)
  console.log(`[Gemini] Iniciando análise. API Key ativa: ${apiKey.substring(0, 4)}...`);

  const prompt = `Analise a capa deste livro e extraia as informações rigorosamente no formato JSON abaixo:
  {
    "title": "título do livro",
    "author": "autor",
    "publisher": "editora",
    "isbn": "isbn apenas números",
    "pageCount": número de páginas
  }
  Retorne APENAS o JSON, sem markdown. Se não encontrar um dado, deixe vazio.`;

  // Lista de modelos na ordem de maior compatibilidade
  const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[Gemini] Tentando com ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData
          }
        },
        { text: prompt }
      ]);

      const response = await result.response;
      const text = response.text();
      console.log(`[Gemini] Resposta bruta de ${modelName}:`, text);

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) continue;

      const rawData = JSON.parse(jsonMatch[0].trim());

      // Normalização: mapeia chaves em português para o formato esperado pelo resto do app
      const normalized = {
        title: rawData.title || rawData.titulo || 'Título Desconhecido',
        author: rawData.author || rawData.autor || 'Autor Desconhecido',
        publisher: rawData.publisher || rawData.editora || '',
        isbn: rawData.isbn || '',
        pageCount: rawData.pageCount || rawData.paginas || rawData.pages || null
      };

      console.log(`[Gemini] Dados extraídos e normalizados:`, normalized);
      return normalized;
    } catch (error: any) {
      console.warn(`[Gemini] Modelo ${modelName} falhou:`, error.message);
      lastError = error;
      if (error.message?.includes("429") || error.message?.includes("403")) break;
      continue;
    }
  }

  // Se chegou aqui, todos falharam
  if (lastError?.message?.includes("404")) {
    throw new Error("Sua chave API não reconheceu nenhum dos modelos disponíveis (Flash ou Pro). Verifique se o Gemini está ativo no seu Google AI Studio.");
  }

  throw lastError || new Error("Falha ao analisar a imagem com todos os modelos disponíveis.");
};
