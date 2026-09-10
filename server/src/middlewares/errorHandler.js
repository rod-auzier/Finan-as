/**
 * Handlers de erro globais do Express.
 *
 * - `notFound`  → captura rotas inexistentes e devolve 404.
 * - `errorHandler` → último middleware da cadeia; padroniza o corpo de erro.
 */

export function notFound(req, res, _next) {
  res.status(404).json({ message: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars -- a assinatura de 4 args é o que marca este como error handler
export function errorHandler(err, req, res, _next) {
  console.error('[erro]', err);

  const status = err.status || 500;
  const message = status === 500 ? 'Erro interno do servidor' : err.message;

  res.status(status).json({ message });
}
