import { z } from 'zod'

export namespace TextPickerSchema {
  export const Action = z.enum(['copy-text', 'quit'])
  export type Action = z.infer<typeof Action>

  export const Props = z.object({
    className: z.string().optional(),
    style: z.custom<React.CSSProperties>().optional(),
    /**
     * @default 2147483647
     */
    zIndex: z
      .number()
      .optional()
      .default(2 ** 31 - 1),
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
    onQuit: z.custom<() => void>().optional(),
  })
  export type Props = z.infer<typeof Props>
  export namespace Props {
    export type Input = z.input<typeof Props>
  }
}
