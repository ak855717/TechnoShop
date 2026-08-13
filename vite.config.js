import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://technoshop-backend-m2ps.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: 'localhost',
    port: 4173,
    strictPort: true,
  },
})
