import path from 'path'
import { defineConfig } from 'vite'

const rootDir = (...paths: string[]) => path.resolve(__dirname, ...paths)

export default defineConfig(() => ({
    build: {
        rollupOptions: {
            input: {
                main: rootDir('index.html'),
            },
        },
        // lib: {
        //     entry: rootDir('lib/main.js'),
        //     name: 'MyLib',
        //     fileName: (format) => `my-lib.${format}.js`,
        // },
    },
    resolve: {
        alias: {
            '~': rootDir('./src'),
        },
    },
}))
