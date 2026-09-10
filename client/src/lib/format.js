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

/**
 * Formata uma data ISO como dd/mm/aaaa. Retorna "—" quando vazia.
 * Usa `timeZone: 'UTC'` porque o vencimento é uma data "de calendário"
 * (sem hora) — sem isso, fusos negativos exibiriam o dia anterior.
 */
export function dataBR(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}
