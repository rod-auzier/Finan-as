/**
 * Controller de Resumo financeiro.
 * Agrega os valores das receitas e despesas do usuário autenticado.
 */
import mongoose from 'mongoose';
import { Receita } from '../models/Receita.js';
import { Despesa } from '../models/Despesa.js';

/**
 * Soma o campo `valor` de todos os documentos de um model pertencentes
 * a um usuário, usando uma aggregation no MongoDB (feito no banco, não em memória).
 *
 * @param   {import('mongoose').Model} Model   — `Receita` ou `Despesa`
 * @param   {string} userId                    — id do usuário (string vinda do JWT)
 * @returns {Promise<number>}                  — soma dos valores; 0 se não houver documentos
 */
async function somarValor(Model, userId) {
  const [resultado] = await Model.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: '$valor' } } },
  ]);
  return resultado?.total ?? 0;
}

/**
 * Retorna os totais financeiros do usuário autenticado.
 *
 * @route   GET /api/resumo
 * @access  Privado — header `Authorization: Bearer <token>`
 * @param   {import('express').Request}  req  — usa apenas `req.userId`; não recebe body/params/query
 * @param   {import('express').Response} res
 * @returns {200} JSON:
 *   ```
 *   {
 *     "totalReceitas": number,  // soma de todos os Receita.valor do usuário
 *     "totalDespesas": number,  // soma de todos os Despesa.valor do usuário
 *     "saldo":         number   // totalReceitas - totalDespesas (pode ser negativo)
 *   }
 *   ```
 * @returns {401} se o token estiver ausente/inválido (barrado pelo middleware antes de chegar aqui).
 */
export async function obterResumo(req, res) {
  const [totalReceitas, totalDespesas] = await Promise.all([
    somarValor(Receita, req.userId),
    somarValor(Despesa, req.userId),
  ]);

  res.json({
    totalReceitas,
    totalDespesas,
    saldo: totalReceitas - totalDespesas,
  });
}
