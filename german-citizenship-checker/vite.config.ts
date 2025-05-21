import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//  https://704e-212-199-32-162.ngrok-free.app
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['5a7d-212-199-32-162.ngrok-free.app'],
  },
})
