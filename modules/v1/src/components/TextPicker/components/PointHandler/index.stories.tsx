import { PointHandlerSchema } from '@/components/TextPicker/components/PointHandler/schema'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { CursorSchema, DirectionSchema } from '@text-picker/core'
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
    cursor: {
      control: 'radio',
      options: Object.values(CursorSchema.Values),
    },
    devMode: {
      control: 'boolean',
    },
    direction: {
      control: 'radio',
      options: Object.values(DirectionSchema.Values),
    },
    x: {
      control: 'boolean',
    },
    y: {
      control: 'boolean',
    },
    onMoveStart: {
      type: 'function',
    },
    onMove: {
      type: 'function',
    },
    onMoveEnd: {
      type: 'function',
    },
  },
  args: PointHandlerSchema.Props.parse({
    devMode: true,
    onMoveStart: fn(),
    onMove: fn(),
    onMoveEnd: fn(),
  } as PointHandlerSchema.Props.Input),
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Moveable: Story = {
  args: {
    moveable: true,
  },
}
