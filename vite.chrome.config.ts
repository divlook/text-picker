import path from 'path'
import { defineConfig } from 'vite'
import { version } from './package.json'

const rootDir = (...paths: string[]) => path.resolve(__dirname, ...paths)

export default defineConfig(({ command, mode }) => {
    if (command !== 'build') {
        return
    }

    const config = {
        background: rootDir('src/chrome/background.ts'),
        content: rootDir('src/chrome/content.ts'),
    }

    return {
        mode: 'production',
        build: {
            outDir: `release/text-picker@${version}`,
            emptyOutDir: false,
            rollupOptions: {
                input: {
                    [mode]: config[mode],
                },
                output: {
                    format: 'umd',
                    entryFileNames: '[name].js',
                },
            },
        },
        resolve: {
            alias: {
                '~': rootDir('./src'),
            },
        },
    }
})
