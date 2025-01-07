import { StorybookSchema } from '@/storybook/schema'

export const defineParameters = (
  input: StorybookSchema.TypedParameters.Input = {},
) => {
  return StorybookSchema.TypedParameters.parse(input)
}
