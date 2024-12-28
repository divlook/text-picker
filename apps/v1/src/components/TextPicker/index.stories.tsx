import { getBgImg } from '@/components/TextPicker/assets'
import { TextPickerSchema } from '@/components/TextPicker/schema'
import { defineParameters } from '@/storybook/utils'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import Component from '.'

const meta = {
  component: Component,
  parameters: defineParameters({
    layout: 'fullscreen',
  }),
  tags: ['!autodocs'],
  argTypes: {
    className: {
      control: 'text',
    },
    style: {
      control: 'object',
    },
    zIndex: {
      control: 'number',
    },
    displayed: {
      control: 'boolean',
    },
    actions: {
      control: 'check',
      options: Object.values(TextPickerSchema.Action.Values),
    },
    onQuit: {
      type: 'function',
    },
  },
  args: TextPickerSchema.Props.parse({
    displayed: true,
    onQuit: fn(),
  } as TextPickerSchema.Props.Input),
  decorators: [
    (Story) => (
      <div
        className="relative"
        style={{
          width: '100vw',
          height: '100vh',
          backgroundImage: `url('${getBgImg()}')`,
        }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
          <p>123</p>
          <p>456</p>
          <p>
            789 <span>abc</span>
          </p>
        </div>

        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/3 left-1/3">
          <p>123</p>
          <p>456</p>
          <p>789</p>
          <img
            src="https://placehold.co/200x150"
            alt="img"
          />
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomActions: Story = {
  args: {
    actions: ['quit', 'copy-text'],
  },
}
