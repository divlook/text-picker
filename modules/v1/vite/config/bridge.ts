import { defineConfig, mergeConfig } from 'vite'
import { dir } from '../utils'
import baseConfig from './base'

export default mergeConfig(
  baseConfig,
  defineConfig({
    build: {
      emptyOutDir: false,
      rollupOptions: {
        input: {
          bridge: dir('src/chrome/entries/bridge.ts'),
        },
        output: {
          format: 'umd',
          entryFileNames: 'entries/[name].js',
        },
      },
    },
  }),
)
