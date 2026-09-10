/**
 * Rota de Resumo — montada em /api/resumo (ver routes/index.js).
 * Exige autenticação.
 *
 *   GET /api/resumo -> obterResumo  ({ totalReceitas, totalDespesas, saldo })
 */
import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { obterResumo } from '../controllers/resumo.controller.js';

const router = Router();

router.get('/', authRequired, asyncHandler(obterResumo));

export default router;
