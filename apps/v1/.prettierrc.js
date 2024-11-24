import globalConfig from '@text-picker/config/prettier.config.js'

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  ...globalConfig,
  plugins: [...(globalConfig.plugins || []), 'prettier-plugin-tailwindcss'],
}

export default config
