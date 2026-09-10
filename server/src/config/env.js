/**
 * Carregamento e validação centralizada das variáveis de ambiente.
 *
 * - `dotenv` lê o arquivo `.env` da raiz da pasta `server/` e injeta
 *   os valores em `process.env`.
 * - Aqui exportamos um objeto `env` já tratado (com defaults e conversões)
 *   para o resto da aplicação não precisar acessar `process.env` diretamente.
 */
import dotenv from 'dotenv';

// Lê o .env e popula process.env. Deve ser chamado o mais cedo possível.
dotenv.config();

/** Lança um erro claro caso uma variável obrigatória não esteja definida. */
function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

export const env = {
  // Porta HTTP (converte para número; usa 3001 como padrão).
  port: Number(process.env.PORT) || 3001,

  // Conexão do MongoDB — obrigatória.
  mongoUri: required('MONGO_URI'),

  // Configuração de JWT.
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Origem liberada no CORS. Opcional: sem valor, a API aceita qualquer
  // origem (ver app.js). Em produção, defina para o domínio do frontend.
  clientUrl: process.env.CLIENT_URL || '',

  // Ambiente de execução.
  nodeEnv: process.env.NODE_ENV || 'development',
};
