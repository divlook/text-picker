import type { ReactNode } from 'react'
import { z } from 'zod'

export namespace ToastSchema {
  export const Props = z.object({
    displayed: z.boolean().optional().default(false),
    message: z.string().optional(),
    inline: z.boolean().optional().default(false),
    wrapperJSX: z
      .custom<
        (arg: {
          message?: string
        }) => ReactNode
      >()
      .optional(),
  })
  export type Props = z.infer<typeof Props>
  export namespace Props {
    export type Input = z.input<typeof Props>
  }

  export const Options = z.object({
    dismissTime: z.number().optional().default(3000),
  })
  export type Options = z.infer<typeof Options>
  export namespace Options {
    export type Input = z.input<typeof Options>
  }

  export const Controller = z.object({
    isDisplayed: z.boolean(),
    message: z.string(),
    showMessage: z.custom<(message: string) => void>(),
    dismiss: z.custom<() => void>(),
  })
  export type Controller = z.infer<typeof Controller>
}
