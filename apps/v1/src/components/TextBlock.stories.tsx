import { ComponentStory, ComponentMeta } from '@storybook/react'
import TextBlock from '~/components/TextBlock'

export default {
    title: 'Components/TextBlock',
    component: TextBlock,
    args: {
        outline: {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
        },
    },
} as ComponentMeta<typeof TextBlock>

const Template: ComponentStory<typeof TextBlock> = (args) => (
    <TextBlock {...args} />
)

export const 기본 = Template.bind({})
기본.args = {}
