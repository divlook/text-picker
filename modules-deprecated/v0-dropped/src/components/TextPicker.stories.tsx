import { ComponentStory, ComponentMeta } from '@storybook/react'
import TextPicker from '~/components/TextPicker'

export default {
    title: 'Components/TextPicker',
    component: TextPicker,
} as ComponentMeta<typeof TextPicker>

const Template: ComponentStory<typeof TextPicker> = (args) => (
    <TextPicker {...args} />
)

export const 기본 = Template.bind({})
기본.args = {
    running: true,
}
