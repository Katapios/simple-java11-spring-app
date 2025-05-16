import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Более быстрый компилятор
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true // Для отладки в production
  },
  server: {
    port: 5173,
    strictPort: true, // Запретить автоматический выбор порта
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'] // Оптимизация зависимостей
  }
})

