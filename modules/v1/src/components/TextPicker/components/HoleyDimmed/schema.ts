import { BoundarySchema } from '@text-picker/core'
import { z } from 'zod'

export namespace HoleyDimmedSchema {
  export const Props = z.object({
    className: z.string().optional(),
    style: z.custom<React.CSSProperties>().optional(),
    displayed: z.boolean().optional().default(false),
    width: z.string().optional().default('100%'),
    height: z.string().optional().default('100%'),
    hole: BoundarySchema.nullable().optional().default(null),
  })
  export type Props = z.infer<typeof Props>
  export namespace Props {
    export type Input = z.input<typeof Props>
  }
}
