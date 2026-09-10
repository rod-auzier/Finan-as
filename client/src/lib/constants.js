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
 * Paleta categórica do gráfico de despesas por categoria (Recharts).
 *
 * É uma paleta de DADOS (uma cor por fatia), separada dos tokens de tema —
 * mas escolhida para funcionar sobre o fundo escuro `--color-bg` (#14181C)
 * e reaproveitando alguns tons do design system:
 *   - Alimentação usa o verde de "positivo" (--color-positive)
 *   - Transporte usa o âmbar de "destaque"  (--color-accent)
 *   - Saúde usa o vermelho de "negativo"    (--color-negative)
 *   - Outros usa o cinza de "texto secundário" (--color-muted)
 * A ordem casa com CATEGORIAS_DESPESA.
 */
export const COR_CATEGORIA = {
  Utilidades: '#5B9BD5', // azul
  Alimentação: '#3ECF8E', // = --color-positive
  Transporte: '#D4A24C', // = --color-accent
  Saúde: '#E2604A', // = --color-negative
  Lazer: '#A78BFA', // roxo
  Outros: '#8B95A1', // = --color-muted
};
