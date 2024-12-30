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
          background: dir('src/chrome/background.ts'),
        },
        output: {
          format: 'es',
          entryFileNames: '[name].js',
          assetFileNames: 'assets/[name].[ext]',
          chunkFileNames: 'assets/[name].js',
        },
      },
    },
  }),
)
