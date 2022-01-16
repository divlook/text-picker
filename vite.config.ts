import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig(() => ({
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
            },
        },
        // lib: {
        //     entry: path.resolve(__dirname, 'lib/main.js'),
        //     name: 'MyLib',
        //     fileName: (format) => `my-lib.${format}.js`,
        // },
    },
}))
