import { ComponentStory, ComponentMeta } from '@storybook/react'
import GuideBox from '~/components/GuideBox'

export default {
    title: 'Components/GuideBox',
    component: GuideBox,
} as ComponentMeta<typeof GuideBox>

const Template: ComponentStory<typeof GuideBox> = (args) => (
    <GuideBox {...args} />
)

export const 좌표_2개 = Template.bind({})
좌표_2개.args = {
    coordinates: [
        [100, 100],
        [200, 200],
    ],
}

export const 좌표_1개 = Template.bind({})
좌표_1개.args = {
    coordinates: [[100, 100]],
}

export const 좌표_0개 = Template.bind({})
