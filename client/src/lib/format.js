/**
 * Helpers de formatação usados pelas telas.
 */

/** Formata um número como moeda brasileira. Ex.: 1234.5 -> "R$ 1.234,50". */
export function brl(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
