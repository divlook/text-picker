import path from 'path'
import { defineConfig } from 'vite'

const rootDir = (...paths: string[]) => path.resolve(__dirname, ...paths)

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: rootDir('index.html'),
            },
        },
    },
    resolve: {
        alias: {
            '~': rootDir('./src'),
        },
    },
})
