import { z } from 'zod'

export const ThemeSchema = z.enum(['primary', 'danger'])
export type ThemeSchema = z.infer<typeof ThemeSchema>
export namespace ThemeSchema {
  export type Input = z.input<typeof ThemeSchema>
}
