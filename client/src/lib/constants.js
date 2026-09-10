/**
 * Constantes compartilhadas do domínio.
 */

/**
 * Categorias válidas para uma Despesa (usadas no <select> do formulário
 * e como base do gráfico de despesas por categoria no Resumo).
 */
export const CATEGORIAS_DESPESA = [
  'Utilidades',
  'Alimentação',
  'Transporte',
  'Saúde',
  'Lazer',
  'Outros',
];

/**
 * Cor fixa por categoria — mantém o gráfico consistente entre renders
 * e telas. A ordem casa com CATEGORIAS_DESPESA.
 */
export const COR_CATEGORIA = {
  Utilidades: '#2563eb',
  Alimentação: '#16a34a',
  Transporte: '#f59e0b',
  Saúde: '#dc2626',
  Lazer: '#9333ea',
  Outros: '#64748b',
};
