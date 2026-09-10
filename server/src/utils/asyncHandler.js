/**
 * Envolve um handler assíncrono e encaminha qualquer rejeição de Promise
 * para o `next()` — ou seja, para o `errorHandler` global.
 *
 * O Express 4 NÃO captura erros de funções `async` automaticamente; sem
 * este wrapper, uma exceção dentro de um controller assíncrono deixaria
 * a requisição pendurada.
 *
 * @param {(req, res, next) => Promise<any>} fn  handler assíncrono
 * @returns {(req, res, next) => void}           handler seguro para o Express
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
