/**
 * Rotas de Receitas — montadas em /api/receitas (ver routes/index.js).
 * TODAS exigem autenticação: o `router.use(authRequired)` abaixo aplica
 * o middleware a cada rota do arquivo.
 *
 *   GET    /api/receitas       -> listarReceitas
 *   POST   /api/receitas       -> criarReceita
 *   DELETE /api/receitas/:id   -> removerReceita
 */
import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { listarReceitas, criarReceita, removerReceita } from '../controllers/receita.controller.js';

const router = Router();

router.use(authRequired);

router.get('/', asyncHandler(listarReceitas));
router.post('/', asyncHandler(criarReceita));
router.delete('/:id', asyncHandler(removerReceita));

export default router;
