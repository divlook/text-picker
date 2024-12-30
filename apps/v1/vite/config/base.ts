import { defineConfig } from 'vite'
import { dir, getOutDir } from '../utils'

const outDir = getOutDir()

export default defineConfig({
  build: {
    outDir,
  },
  resolve: {
    alias: {
      '@': dir('src'),
    },
  },
})
