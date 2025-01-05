import { ToastSchema } from '@/components/Toast/schema'
import { defineParameters } from '@/storybook/utils'
import type { Meta, StoryObj } from '@storybook/react'
import Component from '.'

const meta = {
  component: Component,
  parameters: defineParameters({
    backgrounds: {
      default: 'dark',
    },
  }),
  argTypes: {
    displayed: {
      control: 'boolean',
    },
    message: {
      control: 'text',
    },
    inline: {
      control: 'boolean',
    },
    wrapperJSX: {
      type: 'function',
    },
  },
  args: ToastSchema.Props.parse({
    displayed: true,
    message: 'Message',
  } as ToastSchema.Props.Input),
} satisfies Meta<typeof Component>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Inline: Story = {
  args: {
    inline: true,
  },
}

export const WithWrapperJSX: Story = {
  args: {
    wrapperJSX({ message }) {
      return <div>✉️ {message}</div>
    },
  },
}

export const Hidden: Story = {
  args: {
    displayed: false,
  },
}
