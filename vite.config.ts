import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves this project beneath its repository name.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    watch: process.env.CODEX_SANDBOX === 'seatbelt'
      ? { usePolling: true, useFsEvents: false }
      : undefined,
  },
});
