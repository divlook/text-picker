import { defineConfig, mergeConfig } from 'vite'
import {} from '../../package.json'
import { dir } from '../utils'
import baseConfig from './base'

export default mergeConfig(
  baseConfig,
  defineConfig({
    build: {
      rollupOptions: {
        input: {
          background: dir('src/chrome/entries/background.ts'),
        },
        output: {
          format: 'es',
          entryFileNames: 'entries/[name].js',
          assetFileNames: 'assets/[name].[ext]',
          chunkFileNames: 'assets/[name].js',
        },
      },
    },
  }),
)
