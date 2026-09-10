/**
 * Controller de Despesas.
 *
 * Assim como em Receitas, toda query é filtrada por `req.userId`
 * (injetado pelo middleware `authRequired`), garantindo isolamento
 * entre contas.
 */
import mongoose from 'mongoose';
import { Despesa } from '../models/Despesa.js';

/**
 * Lista as despesas do usuário autenticado.
 *
 * @route   GET /api/despesas
 * @access  Privado — header `Authorization: Bearer <token>`
 * @param   {import('express').Request}  req  — usa `req.userId`; ignora body e query
 * @param   {import('express').Response} res
 * @returns {200} `{ despesas: Array<{ _id, userId, descricao, categoria, valor, createdAt, updatedAt }> }`
 *               ordenado por `createdAt` (mais recentes primeiro).
 */
export async function listarDespesas(req, res) {
  const despesas = await Despesa.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json({ despesas });
}

/**
 * Cria uma despesa para o usuário autenticado.
 *
 * @route   POST /api/despesas
 * @access  Privado
 * @param   {import('express').Request} req
 * @param   {object} req.body
 * @param   {string} req.body.descricao      — o que é a despesa (ex.: "Conta de luz"). Obrigatório.
 * @param   {number} req.body.valor          — quantia a pagar, número ≥ 0. Obrigatório.
 * @param   {string} [req.body.categoria]    — agrupador (ex.: "Moradia"). Opcional → "Outros".
 * @returns {201} `{ despesa: {...} }` — documento criado.
 * @returns {400} `{ message }` — `descricao`/`valor` ausentes ou `valor` inválido.
 */
export async function criarDespesa(req, res) {
  const { descricao, categoria, valor } = req.body ?? {};

  if (!descricao || valor == null) {
    return res.status(400).json({ message: 'descricao e valor são obrigatórios' });
  }
  const valorNum = Number(valor);
  if (Number.isNaN(valorNum) || valorNum < 0) {
    return res.status(400).json({ message: 'valor deve ser um número não-negativo' });
  }

  const despesa = await Despesa.create({
    userId: req.userId,
    descricao,
    categoria,
    valor: valorNum,
  });

  return res.status(201).json({ despesa });
}

/**
 * Remove uma despesa do usuário autenticado.
 *
 * @route   DELETE /api/despesas/:id
 * @access  Privado
 * @param   {import('express').Request} req
 * @param   {string} req.params.id  — ObjectId da despesa a remover.
 * @returns {204} sem corpo — despesa removida.
 * @returns {400} `{ message }` — se `:id` não for um ObjectId válido.
 * @returns {404} `{ message }` — se a despesa não existe OU não pertence ao usuário.
 */
export async function removerDespesa(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'id inválido' });
  }

  const removida = await Despesa.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!removida) {
    return res.status(404).json({ message: 'despesa não encontrada' });
  }

  return res.status(204).send();
}
