import type { Preview } from '@storybook/react'
import { defineParameters } from '../src/storybook/utils'

const preview: Preview = {
  parameters: defineParameters({
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  }),
  tags: ['autodocs'],
}

export default preview
