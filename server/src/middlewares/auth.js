/**
 * Middleware de autenticação por JWT.
 *
 * Uso: coloque `authRequired` antes do handler de qualquer rota protegida.
 *
 * Espera o header:
 *     Authorization: Bearer <token>
 *
 * Comportamento:
 *   - header ausente / fora do formato "Bearer <token>"  -> 401
 *   - token inválido, adulterado ou expirado             -> 401
 *   - token válido -> injeta `req.userId` (id do usuário, lido do claim `sub`)
 *                     e chama `next()`, liberando o acesso à rota.
 */
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'token não fornecido' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.userId = payload.sub; // "sub" (subject) definido em gerarToken()
    return next();
  } catch {
    return res.status(401).json({ message: 'token inválido ou expirado' });
  }
}
