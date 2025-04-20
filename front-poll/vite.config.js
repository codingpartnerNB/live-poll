import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/socket.io': {
        // target: 'http://localhost:5000',
        target: 'https://poll-spark-backend.onrender.com',
        ws: true, // Enable WebSocket proxying
        changeOrigin: true,
      },
      '/api': {
        target: 'https://poll-spark-backend.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
