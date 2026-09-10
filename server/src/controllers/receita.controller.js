/**
 * Controller de Receitas.
 *
 * Todas as ações são escopadas ao usuário autenticado: o middleware
 * `authRequired` injeta `req.userId`, e cada query usa `{ userId: req.userId }`.
 * Assim, um usuário nunca lê nem apaga receitas de outro.
 */
import mongoose from 'mongoose';
import { Receita } from '../models/Receita.js';

/**
 * Lista as receitas do usuário autenticado.
 *
 * @route   GET /api/receitas
 * @access  Privado — header `Authorization: Bearer <token>`
 * @param   {import('express').Request}  req  — usa `req.userId`; ignora body e query
 * @param   {import('express').Response} res
 * @returns {200} `{ receitas: Array<{ _id, userId, fonte, descricao, valor, createdAt, updatedAt }> }`
 *               ordenado por `createdAt` (mais recentes primeiro).
 */
export async function listarReceitas(req, res) {
  const receitas = await Receita.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json({ receitas });
}

/**
 * Cria uma receita para o usuário autenticado.
 *
 * @route   POST /api/receitas
 * @access  Privado
 * @param   {import('express').Request} req
 * @param   {object} req.body
 * @param   {string} req.body.fonte        — origem do dinheiro (ex.: "Salário"). Obrigatório.
 * @param   {number} req.body.valor        — quantia recebida, número ≥ 0. Obrigatório.
 * @param   {string} [req.body.descricao]  — detalhe livre. Opcional.
 * @returns {201} `{ receita: {...} }` — documento criado (com `_id` e `createdAt`).
 * @returns {400} `{ message }` — se `fonte`/`valor` ausentes ou `valor` não for número ≥ 0.
 */
export async function criarReceita(req, res) {
  const { fonte, descricao, valor } = req.body ?? {};

  if (!fonte || valor == null) {
    return res.status(400).json({ message: 'fonte e valor são obrigatórios' });
  }
  const valorNum = Number(valor);
  if (Number.isNaN(valorNum) || valorNum < 0) {
    return res.status(400).json({ message: 'valor deve ser um número não-negativo' });
  }

  const receita = await Receita.create({
    userId: req.userId,
    fonte,
    descricao,
    valor: valorNum,
  });

  return res.status(201).json({ receita });
}

/**
 * Remove uma receita do usuário autenticado.
 *
 * @route   DELETE /api/receitas/:id
 * @access  Privado
 * @param   {import('express').Request} req
 * @param   {string} req.params.id  — ObjectId da receita a remover.
 * @returns {204} sem corpo — receita removida.
 * @returns {400} `{ message }` — se `:id` não for um ObjectId válido.
 * @returns {404} `{ message }` — se a receita não existe OU não pertence ao usuário.
 */
export async function removerReceita(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'id inválido' });
  }

  const removida = await Receita.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!removida) {
    return res.status(404).json({ message: 'receita não encontrada' });
  }

  return res.status(204).send();
}
