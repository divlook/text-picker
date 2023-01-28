import path from 'path'
import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { version } from './package.json'

const definedModes = ['chrome.background', 'chrome.content'] as const

type Mode = typeof definedModes[number]

const rootDir = (...paths: string[]) => path.resolve(__dirname, ...paths)

export default defineConfig(({ command, mode }) => {
    const typedMode = mode as Mode

    if (command === 'build' && definedModes.includes(typedMode)) {
        return getChromeConfig(typedMode)
    }

    throw new Error('사용하지 않는 기능입니다.')
})

function getChromeConfig(mode: Mode): UserConfig {
    let inputKey: string
    let inputValue: string

    switch (mode) {
        case 'chrome.background': {
            inputKey = 'background'
            inputValue = rootDir('src/chrome/background.ts')
            break
        }

        case 'chrome.content': {
            inputKey = 'content'
            inputValue = rootDir('src/chrome/content.ts')
            break
        }
    }

    return {
        mode: 'production',
        build: {
            outDir: `release/text-picker@${version}`,
            emptyOutDir: false,
            rollupOptions: {
                input: {
                    [inputKey]: inputValue,
                },
                output: {
                    format: 'umd',
                    entryFileNames: '[name].js',
                },
            },
        },
        resolve: {
            alias: getPathAlias(),
        },
        plugins: [reactPlugin()],
    }
}

function reactPlugin() {
    return react({
        exclude: rootDir('./src/**/*.stories.*'),
        include: rootDir('./src/**/*.tsx'),
    })
}

export function getPathAlias() {
    return {
        '~': rootDir('./src'),
    }
}
