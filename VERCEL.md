# Guia de Implantação Vercel - BookScanner Pro AI

Para colocar o seu projeto no ar via Vercel, siga os passos abaixo:

## 1. Configurações de Build
O projeto já está configurado para o Vite. Na Vercel, utilize estas configurações:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

## 2. Variáveis de Ambiente (CRÍTICO)
Você precisará adicionar as seguintes variáveis no painel da Vercel para que o Firebase e o Gemini funcionem:

| Variável | Valor (copie do seu .env.local) |
| :--- | :--- |
| `GEMINI_API_KEY` | Sua chave da API Gemini |
| `VITE_FIREBASE_API_KEY` | Chave do Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domínio de Auth do Firebase |
| `VITE_FIREBASE_PROJECT_ID` | ID do Projeto Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de Storage |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ID do Sender |
| `VITE_FIREBASE_APP_ID` | ID do App |

## 3. Comandos Úteis
Se você tiver a CLI da Vercel instalada:
1. `vercel` (para deploy de preview)
2. `vercel --prod` (para deploy de produção)

## 4. Observações
- O arquivo `vercel.json` foi adicionado para garantir que as rotas (como Biblioteca, Ajustes, etc.) funcionem corretamente mesmo após o refresh da página.
- Certifique-se de que a COLLECTION do Firebase e as regras de segurança estão configuradas para aceitar conexões da URL da Vercel.
