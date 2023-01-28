const path = require('path')
const { mergeConfig } = require('vite')

/**
 * @type {import('@storybook/builder-vite').StorybookViteConfig}
 */
const config = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
    ],
    framework: '@storybook/react',
    core: {
        builder: '@storybook/builder-vite',
    },
    features: {
        storyStoreV7: true,
    },
    async viteFinal(config) {
        return mergeConfig(config, {
            resolve: {
                alias: {
                    '~': path.resolve(__dirname, '../src'),
                },
            },
        })
    },
}

module.exports = config