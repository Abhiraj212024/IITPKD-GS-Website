import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This tells Vite: "If a request starts with /member, send it to the backend"
      '/member': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/alumni': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})