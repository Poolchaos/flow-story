import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/flow-story/', // GitHub repository name
  plugins: [react()],
})
