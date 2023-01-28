import { ComponentStory, ComponentMeta } from '@storybook/react'
import Backdrop from '~/components/Backdrop'

export default {
    title: 'Components/Backdrop',
    component: Backdrop,
    argTypes: {
        activated: {
            defaultValue: false,
        },
        zIndex: {
            defaultValue: 0,
        },
    },
} as ComponentMeta<typeof Backdrop>

const Template: ComponentStory<typeof Backdrop> = (args) => (
    <Backdrop {...args} />
)

export const 예제 = Template.bind({})
