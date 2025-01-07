import { ComponentStory, ComponentMeta } from '@storybook/react'
import Backdrop from '~/components/Backdrop'

export default {
    title: 'Components/Backdrop',
    component: Backdrop,
} as ComponentMeta<typeof Backdrop>

const Template: ComponentStory<typeof Backdrop> = (args) => (
    <Backdrop {...args} />
)

export const 활성화 = Template.bind({})
활성화.args = {
    activated: true,
}

export const 비활성화 = Template.bind({})
