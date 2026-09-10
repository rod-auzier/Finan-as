/**
 * Ponte entre os tokens de cor (definidos em `src/index.css` :root) e o
 * JavaScript.
 *
 * A maioria dos componentes usa classes Tailwind (`bg-surface`, `text-positive`
 * etc.) e não precisa disto. Mas alguns pontos recebem cor via prop de estilo
 * — em especial o Recharts (SVG) — e aí lemos o valor da CSS variable em
 * runtime, mantendo UMA única fonte de verdade.
 *
 * @param {string} nome  sufixo do token, ex.: 'surface' → `--color-surface`
 * @returns {string} valor da cor (ex.: "#1c2227"); '' se rodar fora do browser
 */
export function token(nome) {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${nome}`)
    .trim();
}
