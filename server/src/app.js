/**
 * Configuração da aplicação Express (sem "subir" o servidor).
 *
 * Separar `app` de `index.js` facilita testes de integração, que podem
 * importar o `app` sem abrir uma porta.
 */
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { connectToDatabase } from './config/db.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();

// CORS: quando o frontend é servido do mesmo domínio da API (deploy na
// Vercel) as chamadas são same-origin e o CORS nem entra em ação. Se
// `CLIENT_URL` estiver definido, restringe a esse domínio; senão, libera.
app.use(cors({ origin: env.clientUrl || true, credentials: true }));

// Faz o parse de corpos JSON (req.body).
app.use(express.json());

// Log minimalista de requisições (vai para o console local ou os logs da Vercel).
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Garante a conexão com o MongoDB antes de qualquer rota. Em serverless a
// conexão é reaproveitada entre invocações (cache em config/db.js); no
// servidor local o index.js já conectou, então aqui vira um no-op.
app.use(async (_req, _res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

// Rotas da API.
app.use('/api', apiRoutes);

// 404 e tratamento de erros (sempre por último).
app.use(notFound);
app.use(errorHandler);

export default app;
