import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Try to compute a sensible `base` for GitHub Pages from package.json.name
// You can override with environment variable VITE_BASE
const pkgPath = resolve(process.cwd(), 'package.json')
let pkg = {}
try {
  pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
} catch (e) {
  // ignore
}

const inferredBase = pkg.name ? `/${pkg.name}/` : '/'
const base = process.env.VITE_BASE || inferredBase

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use inferred base only for build; keep '/' for dev server to avoid unexpected redirects
  base: command === 'build' ? base : '/',
  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src'),
    },
  },
}))
