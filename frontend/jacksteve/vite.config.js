import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 🛰️ ADD THESE TWO BLOCKS TO KILL THE INJECTION ERROR
  optimizeDeps: {
    exclude: ['lightningcss', 'daisyui']
  },
  server: {
    // This helps Vite distinguish between the CSS and JS bundles
    hmr: {
      overlay: false 
    },
    proxy: {
      '/api': {
        target: 'http://localhost:10000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
