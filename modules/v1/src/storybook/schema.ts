import { z } from 'zod'

export namespace StorybookSchema {
  export const TypedParameters = z
    .object({
      layout: z.enum(['centered', 'fullscreen', 'padded']).default('padded'),
      backgrounds: z.object({
        default: z.enum(['light', 'dark', 'white']).default('light'),
      }),
    })
    .partial()
    .passthrough()
    .transform((input) => {
      return {
        ...input,
        backgrounds: {
          default: input.backgrounds?.default || 'light',
          values: [
            { name: 'light', value: '#F8F8F8' },
            { name: 'dark', value: '#333' },
            { name: 'white', value: '#fff' },
          ],
        },
      }
    })
  export type TypedParameters = z.infer<typeof TypedParameters>
  export namespace TypedParameters {
    export type Input = z.input<typeof TypedParameters>
  }
}
