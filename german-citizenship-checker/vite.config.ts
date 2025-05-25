import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//  https://704e-212-199-32-162.ngrok-free.app
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['772f-212-199-32-162.ngrok-free.app'],
  },
})
