/**
 * Rotas de autenticação. Montadas na raiz de /api (ver routes/index.js):
 *   POST /api/register   -> cria usuário
 *   POST /api/login      -> retorna JWT
 *   GET  /api/me         -> dados do usuário autenticado (protegida)
 */
import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Públicas
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));

// Protegida: só passa com `Authorization: Bearer <token>` válido.
router.get('/me', authRequired, asyncHandler(me));

export default router;
