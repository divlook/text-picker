import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  outDir: 'dist',
  format: 'esm',
  sourcemap: true,
  clean: true,
  dts: true,
  minify: true,
})
