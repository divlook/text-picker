import { type BoundarySchema, pixel } from '@text-picker/core'

export namespace HoleyDimmedFns {
  export function generateClipPath(boundary: BoundarySchema | null = null) {
    if (!boundary) {
      return undefined
    }

    const top = pixel(boundary.top)
    const bottom = pixel(boundary.bottom)
    const left = pixel(boundary.left)
    const right = pixel(boundary.right)

    const points = [
      `0 ${top}`,
      // 외부 상자 (시계방향)
      `0 0, 100% 0, 100% 100%, 0 100%`,
      `0 ${top}`,
      // 내부 상자 (반시계방향)
      `${left} ${top}, ${left} ${bottom}, ${right} ${bottom}, ${right} ${top}`,
    ]

    return `polygon(${points.join(', ')})`
  }
}
