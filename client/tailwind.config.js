/**
 * Configuração do Tailwind CSS.
 *
 * - `content`: arquivos escaneados para gerar só as classes usadas.
 * - `theme.extend`: extensões do tema padrão (cores, fontes, raios).
 *
 * ────────────────────────────────────────────────────────────────────────────
 * TOKENS DE COR
 * ────────────────────────────────────────────────────────────────────────────
 * As cores NÃO ficam aqui — ficam em `src/index.css` (bloco `:root`), como
 * CSS custom properties. Abaixo apenas MAPEAMOS cada variável para um nome de
 * classe utilitária. Assim há uma única fonte de verdade e trocar o tema é
 * editar um arquivo só.
 *
 *   Classe (exemplos)                 Variável (src/index.css)   Papel
 *   -------------------------------   ------------------------   ------------------------
 *   bg-bg                             --color-bg                 fundo da página
 *   bg-surface                        --color-surface            cards, inputs, sidebar
 *   border / border-border            --color-border             hairlines e contornos
 *   text-fg                           --color-fg                 texto principal
 *   text-muted                        --color-muted              texto secundário/labels
 *   text-positive / bg-positive       --color-positive           receitas, superávit, > 0
 *   text-negative / bg-negative       --color-negative           despesas, déficit, < 0
 *   bg-accent / text-accent           --color-accent             ações, links, nav ativa
 * ────────────────────────────────────────────────────────────────────────────
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        fg: 'var(--color-fg)',
        muted: 'var(--color-muted)',
        positive: 'var(--color-positive)',
        negative: 'var(--color-negative)',
        accent: 'var(--color-accent)',
      },
      // Faz `border`, `divide-y` e `ring` usarem o token de borda por padrão.
      borderColor: { DEFAULT: 'var(--color-border)' },
      divideColor: { DEFAULT: 'var(--color-border)' },
      ringColor: { DEFAULT: 'var(--color-accent)' },

      fontFamily: {
        // Interface (textos e labels): Inter, com Manrope e system-ui de reserva.
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        // Números / valores monetários: monoespaçada (aplicada junto de `tabular-nums`).
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      borderRadius: {
        // "Cantos pouco arredondados" — mais discretos que o padrão do Tailwind.
        DEFAULT: '4px',
        md: '5px',
        lg: '6px',
        xl: '8px',
      },
    },
  },
  plugins: [],
};
