/**
 * Conexão com o MongoDB via Mongoose — com cache.
 *
 * Por que cache? Em ambiente serverless (Vercel) a mesma instância da
 * função pode atender várias requisições, e novas instâncias sobem a
 * qualquer momento. Sem cache, cada invocação abriria uma conexão nova
 * ("connection storm") e estouraria o limite do cluster.
 *
 * `connectToDatabase()` é idempotente:
 *  - na 1ª chamada dispara `mongoose.connect` e guarda a Promise;
 *  - nas chamadas seguintes devolve a conexão já aberta na hora.
 *
 * O cache fica em `globalThis` para sobreviver ao "hot reload" de módulos.
 */
import mongoose from 'mongoose';
import { env } from './env.js';

const globalCache = globalThis;
globalCache._mongoose ??= { conn: null, promise: null };
const cached = globalCache._mongoose;

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    // `bufferCommands: false`: em vez de enfileirar queries enquanto não há
    // conexão, falha rápido — combina com o middleware que aguarda a conexão.
    cached.promise = mongoose.connect(env.mongoUri, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
    console.log('[db] Conectado ao MongoDB');
  } catch (error) {
    cached.promise = null; // permite nova tentativa na próxima requisição
    throw error;
  }

  return cached.conn;
}
