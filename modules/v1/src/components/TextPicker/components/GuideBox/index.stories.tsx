import { GuideBoxSchema } from '@/components/TextPicker/components/GuideBox/schema'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import Component from '.'

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    className: {
      control: 'text',
    },
    style: {
      control: 'object',
    },
    inactive: {
      control: 'boolean',
    },
    devMode: {
      control: 'boolean',
    },
    onLayout: {
      type: 'function',
    },
  },
  args: GuideBoxSchema.Props.parse({
    devMode: true,
    onLayout: fn(),
  } as GuideBoxSchema.PropsInput),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
