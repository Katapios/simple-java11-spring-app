import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/", // оставь так, если фронт доступен по корню
  plugins: [react()],
  build: {
    outDir: 'dist', // куда кладутся сборочные файлы
    emptyOutDir: true,
  },
  server: {
    port: 5173, // можно опустить, если по умолчанию
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
