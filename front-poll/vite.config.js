import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
const PORT = import.meta.env.PORT;
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/socket.io': {
        target: `${PORT}`,
        ws: true, // Enable WebSocket proxying
        changeOrigin: true,
      },
      '/api': {
        target: `${PORT}`,
        changeOrigin: true,
      },
    },
  },
})
