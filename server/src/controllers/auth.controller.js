/**
 * Controller de autenticação.
 * Rotas: POST /api/register, POST /api/login, GET /api/me (protegida).
 */
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

/**
 * Assina um JWT cujo "subject" (claim `sub`) é o id do usuário.
 * O middleware `authRequired` lê esse `sub` e o injeta como `req.userId`.
 */
function gerarToken(user) {
  return jwt.sign({}, env.jwtSecret, {
    subject: String(user._id),
    expiresIn: env.jwtExpiresIn, // ex.: "7d"
  });
}

/**
 * POST /api/register
 *
 * Recebe (JSON): { email, senha }
 * Valida:
 *   - email e senha presentes           -> 400
 *   - senha com pelo menos 6 caracteres -> 400
 *   - email ainda não cadastrado        -> 409
 * Faz:
 *   - gera hash bcrypt da senha (User.definirSenha) e cria o usuário.
 * Retorna:
 *   - 201 { user, token }   (user sem o campo `senha`; token JWT recém-emitido)
 */
export async function register(req, res) {
  const { email, senha } = req.body ?? {};

  if (!email || !senha) {
    return res.status(400).json({ message: 'email e senha são obrigatórios' });
  }
  if (String(senha).length < 6) {
    return res.status(400).json({ message: 'a senha deve ter ao menos 6 caracteres' });
  }

  const jaExiste = await User.findOne({ email: String(email).toLowerCase() });
  if (jaExiste) {
    return res.status(409).json({ message: 'email já cadastrado' });
  }

  const user = new User({ email });
  await user.definirSenha(senha);
  await user.save();

  return res.status(201).json({ user, token: gerarToken(user) });
}

/**
 * POST /api/login
 *
 * Recebe (JSON): { email, senha }
 * Valida:
 *   - email e senha presentes                          -> 400
 *   - existe usuário com o email E a senha confere      -> 401 se não
 *     (bcrypt.compare via User.verificarSenha)
 * Retorna:
 *   - 200 { user, token }   (token JWT válido por env.jwtExpiresIn)
 */
export async function login(req, res) {
  const { email, senha } = req.body ?? {};

  if (!email || !senha) {
    return res.status(400).json({ message: 'email e senha são obrigatórios' });
  }

  // `+senha` força trazer o campo que no schema tem `select: false`.
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+senha');
  if (!user || !(await user.verificarSenha(senha))) {
    return res.status(401).json({ message: 'credenciais inválidas' });
  }

  return res.json({ user, token: gerarToken(user) });
}

/**
 * GET /api/me  (rota protegida — exige `authRequired`)
 *
 * Recebe: header `Authorization: Bearer <token>` (o body é ignorado).
 * Valida: o middleware já garantiu o token; aqui só confirmamos que o
 *         usuário ainda existe no banco.
 * Retorna:
 *   - 200 { user }          usuário do token
 *   - 404 { message }       se o usuário foi removido depois da emissão
 */
export async function me(req, res) {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'usuário não encontrado' });
  }
  return res.json({ user });
}
