import { DirectionSchema } from '@text-picker/core'
import { z } from 'zod'

export namespace MoveableHandlerSchema {
  export const Options = z.object({
    direction: DirectionSchema.optional().default('all'),
    moveable: z.boolean().optional().default(false),
    onMoveStart: z.custom<() => void>().optional(),
    onMove: z.custom<(movement: { x: number; y: number }) => void>().optional(),
    onMoveEnd: z.custom<() => void>().optional(),
  })
  export type Options = z.infer<typeof Options>
  export namespace Options {
    export type Input = z.input<typeof Options>
  }
}
