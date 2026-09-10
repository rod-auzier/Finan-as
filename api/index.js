/**
 * Serverless Function da Vercel — responde por tudo em `/api/*`.
 *
 * A Vercel trata qualquer arquivo dentro de `/api` como uma função.
 * O `vercel.json` reescreve `/api/(.*)` para cá, e este arquivo apenas
 * reexporta o app Express de `server/src/app.js` — o MESMO app usado
 * pelo servidor local (`server/src/index.js`).
 *
 * Um app Express é `(req, res) => void`, exatamente o formato que a
 * Vercel espera de um handler. Não chamamos `app.listen()` aqui: a
 * Vercel cuida do ciclo de request/response. A conexão com o MongoDB
 * é aberta sob demanda e cacheada entre invocações (ver server/src/app.js
 * e server/src/config/db.js).
 *
 * Variáveis de ambiente necessárias (configurar no painel da Vercel):
 *   - MONGO_URI
 *   - JWT_SECRET
 *   - JWT_EXPIRES_IN (opcional, padrão "7d")
 *   - CLIENT_URL     (opcional)
 */
import app from '../server/src/app.js';

export default app;
