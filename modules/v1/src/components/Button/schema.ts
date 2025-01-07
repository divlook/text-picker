import { ThemeSchema } from '@text-picker/core/styling/const'
import type { ReactNode } from 'react'
import { z } from 'zod'

export namespace ButtonSchema {
  export const Label = z.custom<(() => ReactNode) | ReactNode>()
  export type Label = z.infer<typeof Label>

  export const Props = z.object({
    className: z.string().optional(),
    style: z.custom<React.CSSProperties>().optional(),
    label: Label,
    theme: ThemeSchema.optional().default('primary'),
    disalbed: z.boolean().optional().default(false),
    onClick: z
      .custom<(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void>()
      .optional(),
  })

  export type Props = z.infer<typeof Props>
  export type PropsInput = z.input<typeof Props>
}
