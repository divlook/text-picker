import react from '@vitejs/plugin-react'
import { defineConfig, mergeConfig } from 'vite'
import { chromeManifestPlugin, dir } from '../utils'
import baseConfig from './base'

export default mergeConfig(
  baseConfig,
  defineConfig({
    build: {
      emptyOutDir: false,
      rollupOptions: {
        input: {
          tab: dir('src/chrome/entries/tab.tsx'),
        },
        output: {
          format: 'es',
          entryFileNames: 'entries/[name].js',
          assetFileNames: 'assets/[name].[ext]',
          chunkFileNames: 'assets/[name].js',
        },
      },
    },
    plugins: [
      react({
        exclude: dir('src/**/*.stories.*'),
        include: dir('src/**/*.tsx'),
      }),
      chromeManifestPlugin(),
    ],
  }),
)
