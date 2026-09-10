/**
 * Ponto de entrada do backend NO SERVIDOR LOCAL (`npm run dev` / `npm start`).
 *
 * No deploy da Vercel este arquivo NÃO é usado: lá o `api/index.js`
 * reexporta o `app` como Serverless Function e a conexão com o banco
 * acontece sob demanda (ver `src/app.js` + `src/config/db.js`).
 *
 * 1. Conecta ao MongoDB (falha rápido se não conseguir).
 * 2. Sobe o servidor HTTP do Express.
 */
import app from './app.js';
import { env } from './config/env.js';
import { connectToDatabase } from './config/db.js';

async function bootstrap() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('[db] Falha ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log(`[http] API rodando em http://localhost:${env.port} (${env.nodeEnv})`);
  });
}

bootstrap();
