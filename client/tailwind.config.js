/**
 * Configuração do Tailwind CSS.
 *
 * - `content`: lista de arquivos que o Tailwind escaneia para descobrir
 *   quais classes utilitárias gerar (tree-shaking do CSS). Precisa cobrir
 *   todos os arquivos onde classes são usadas.
 * - `theme.extend`: ponto para adicionar cores, fontes e espaçamentos
 *   personalizados sem sobrescrever o tema padrão.
 * - `plugins`: plugins oficiais/terceiros (forms, typography, etc.).
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cor de destaque do painel.
        brand: {
          DEFAULT: '#2563eb',
          dark: '#1e40af',
        },
      },
    },
  },
  plugins: [],
};
