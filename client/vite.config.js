/**
 * Configuração do Vite (bundler/dev server do frontend).
 *
 * - `@vitejs/plugin-react`: habilita JSX, Fast Refresh (HMR) e Babel/SWC.
 * - `server.port`: porta do dev server (bate com CLIENT_URL do backend).
 * - `server.proxy`: encaminha chamadas `/api` para o backend, evitando
 *   configuração de CORS durante o desenvolvimento e mantendo as URLs
 *   relativas no código do frontend.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // porta do backend (server/.env → PORT)
        changeOrigin: true,
      },
    },
  },
});
