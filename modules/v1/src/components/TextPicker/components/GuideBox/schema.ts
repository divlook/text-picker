import type { BoundingBoxSchema } from '@text-picker/core'
import type { RefObject } from 'react'
import { z } from 'zod'

export namespace GuideBoxSchema {
  export const Controller = z.custom<{
    resetState: () => void
  }>()
  export type Controller = z.infer<typeof Controller>

  export const Props = z.object({
    className: z.string().optional(),
    style: z.custom<React.CSSProperties>().optional(),
    inactive: z.boolean().optional().default(false),
    devMode: z.boolean().optional().default(false),
    controllerRef: z.custom<RefObject<Controller>>().optional(),
    onLayout: z
      .custom<
        (layout: {
          relative: BoundingBoxSchema
          absolute: BoundingBoxSchema
        }) => void
      >()
      .optional(),
  })
  export type Props = z.infer<typeof Props>
  export type PropsInput = z.input<typeof Props>
}
