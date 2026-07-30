import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Normalise the base so it always has a leading and trailing slash (Vite requires this for
// import.meta.env.BASE_URL to resolve correctly). Accepts "workshop", "/workshop", "/workshop/".
const rawBase = process.env.VITE_BASE_PATH || '/'
const base = rawBase === '/' ? '/' : `/${rawBase.replace(/^\/+|\/+$/g, '')}/`

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
