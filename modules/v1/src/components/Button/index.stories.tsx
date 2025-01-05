import { ButtonSchema } from '@/components/Button/schema'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ThemeSchema } from '@text-picker/core'
import Component from '.'

const meta = {
  component: Component,
  argTypes: {
    className: {
      control: 'text',
    },
    style: {
      control: 'object',
    },
    label: {
      control: 'text',
    },
    theme: {
      control: 'radio',
      options: Object.values(ThemeSchema.Enum),
    },
    disalbed: {
      control: 'boolean',
    },
    onClick: {
      type: 'function',
    },
  },
  args: ButtonSchema.Props.parse({
    label: 'Button',
    onClick: fn(),
  } as ButtonSchema.PropsInput),
} satisfies Meta<typeof Component>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const PrimaryTheme: Story = {
  args: {
    theme: 'primary',
  },
}
export const DangerTheme: Story = {
  args: {
    theme: 'danger',
  },
}

export const Disalbed: Story = {
  args: {
    disalbed: true,
  },
}
