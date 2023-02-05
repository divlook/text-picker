import { ComponentStory, ComponentMeta } from '@storybook/react'
import { defineParameters } from '~/libs/storybook/utils'
import Example from '~/views/Example'

export default {
    title: 'Pages/Example',
    component: Example,
    parameters: {
        ...defineParameters({
            layout: 'fullscreen',
        }),
    },
} as ComponentMeta<typeof Example>

const Template: ComponentStory<typeof Example> = (args) => <Example {...args} />

export const 예제 = Template.bind({})
