import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** GitHub Pages project site: https://ileivoivm.github.io/fxhash2aluan/ */
const base = process.env.VITE_BASE_PATH ?? '/fxhash2aluan/'

export default defineConfig({
  plugins: [react()],
  base,
})
