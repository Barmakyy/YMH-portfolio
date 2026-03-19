import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit to suppress warnings
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large vendor libraries into separate chunks
          'spline': ['@splinetool/react-spline'],
          'recharts': ['recharts'],
          'framer': ['framer-motion'],
          'vendor': ['react', 'react-dom', 'react-router-dom', 'axios'],
        },
      },
    },
  },
})
