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
          content: dir('src/chrome/scripts/content.ts'),
        },
        output: {
          format: 'umd',
          entryFileNames: '[name].js',
        },
      },
    },
  }),
)
