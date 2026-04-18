import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Any request to /api/... from the frontend will be forwarded to port 8080
      // This avoids CORS entirely — the browser thinks everything is same-origin
      '/api': {
        target: 'http://localhost:9091',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
