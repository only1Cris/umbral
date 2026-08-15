import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/umbral/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    watch: {
      ignored: ['**/ezgif-secuence-frames/**', '**/UMBRAL/**', '**/assets/**'],
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false,
      },
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          gsap: ['gsap', 'lenis'],
        },
      },
    },
  },
});
