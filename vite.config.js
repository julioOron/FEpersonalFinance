import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"]
    },
    server: {
        host: true,          // permite conexiones externas
        port: 5173,          // puedes cambiarlo si quieres
        strictPort: true     // evita que cambie el puerto automáticamente
      }
  })
  
