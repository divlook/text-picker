import { z } from 'zod'

export namespace TextPickerSchema {
  export const Action = z.enum(['copy-text', 'copy-html', 'quit'])
  export type Action = z.infer<typeof Action>

  export const Props = z.object({
    className: z.string().optional(),
    style: z.custom<React.CSSProperties>().optional(),
    zIndex: z.number().optional(),
    displayed: z.boolean().optional().default(false),
    actions: z
      .array(Action)
      .optional()
      .default(Object.values(Action.Values))
      .transform((input) => {
        if (!input.length) {
          return Object.values(Action.Values)
        }
        return input
      }),
  })
  export type Props = z.infer<typeof Props>
  export namespace Props {
    export type Input = z.input<typeof Props>
  }
}
