/**
 * Configuração do PostCSS.
 *
 * O Vite processa o CSS através do PostCSS usando estes plugins:
 * - `tailwindcss`: transforma as diretivas `@tailwind` e as classes
 *   utilitárias no CSS final.
 * - `autoprefixer`: adiciona prefixos de fornecedor (-webkit-, -moz-, ...)
 *   com base no browserslist, para compatibilidade entre navegadores.
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
