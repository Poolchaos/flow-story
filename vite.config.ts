import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/12-flow-story-react/', // Required for GitHub Pages deployment
  plugins: [react()],
})
