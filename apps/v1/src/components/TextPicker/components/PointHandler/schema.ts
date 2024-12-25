import { CursorSchema, DirectionSchema } from '@text-picker/core'
import { z } from 'zod'

export namespace PointHandlerSchema {
  export const Props = z.object({
    className: z.string().optional(),
    style: z.custom<React.CSSProperties>().optional(),
    inactive: z.boolean().optional().default(false),
    cursor: CursorSchema.optional().default('move'),
    devMode: z.boolean().optional().default(false),
    direction: DirectionSchema.optional().default('all'),
    x: z.number().optional().default(0),
    y: z.number().optional().default(0),
    moveable: z.boolean().optional().default(false),
    onMoveStart: z.custom<() => void>().optional(),
    onMove: z.custom<(movement: { x: number; y: number }) => void>().optional(),
    onMoveEnd: z.custom<() => void>().optional(),
  })
  export type Props = z.infer<typeof Props>
  export namespace Props {
    export type Input = z.input<typeof Props>
  }
}
