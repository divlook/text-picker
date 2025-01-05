import { z } from 'zod'

export * from '@/styling/const.js'
export * from '@/styling/unit.js'

export const DirectionSchema = z.enum(['horizontal', 'vertical', 'all'])
export type DirectionSchema = z.infer<typeof DirectionSchema>

export const CursorSchema = z.enum([
  'move',
  'ns-resize',
  'ew-resize',
  'nesw-resize',
  'nwse-resize',
])
export type CursorSchema = z.infer<typeof CursorSchema>

export const BoundarySchema = z.object({
  top: z.number().optional().default(0),
  right: z.number().optional().default(0),
  bottom: z.number().optional().default(0),
  left: z.number().optional().default(0),
})
export type BoundarySchema = z.infer<typeof BoundarySchema>
export namespace BoundarySchema {
  export type Input = z.input<typeof BoundarySchema>
}

export const BoundaryWithOffsetSchema = z
  .object({
    x: z.number().optional().default(0),
    y: z.number().optional().default(0),
  })
  .merge(BoundarySchema)
export type BoundaryWithOffsetSchema = z.infer<typeof BoundaryWithOffsetSchema>
export namespace BoundaryWithOffsetSchema {
  export type Input = z.input<typeof BoundaryWithOffsetSchema>
}

export const BoundingBoxSchema = z
  .object({
    width: z.number(),
    height: z.number(),
  })
  .merge(BoundaryWithOffsetSchema)
export type BoundingBoxSchema = z.infer<typeof BoundingBoxSchema>
export namespace BoundingBoxSchema {
  export type Input = z.input<typeof BoundingBoxSchema>
}
