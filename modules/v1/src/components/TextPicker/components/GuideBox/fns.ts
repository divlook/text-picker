import { GuideBoxConst } from '@/components/TextPicker/components/GuideBox/const'
import type { PointHandlerSchema } from '@/components/TextPicker/components/PointHandler/schema'
import {
  BoundaryWithOffsetSchema,
  type BoundingBoxSchema,
} from '@text-picker/core'

export namespace GuideBoxFns {
  export function getInitialBoxState() {
    return BoundaryWithOffsetSchema.parse({
      right: GuideBoxConst.MIN_WIDTH,
      bottom: GuideBoxConst.MIN_HEIGHT,
    } as BoundaryWithOffsetSchema.Input)
  }

  export function getInitialMovedBoxState() {
    return BoundaryWithOffsetSchema.parse({})
  }

  export function createPointHandlers(payload: {
    updateMovedBoxState(next: Partial<BoundaryWithOffsetSchema>): void
  }): {
    props(): PointHandlerSchema.Props.Input
  }[] {
    return [
      {
        // top,left
        props() {
          return {
            cursor: 'nwse-resize',
            style: {
              top: 0,
              left: 0,
              translate: '-50% -50%',
            },
            onMove({ x, y }) {
              payload.updateMovedBoxState({
                x,
                y,
                left: x,
                top: y,
              })
            },
          }
        },
      },
      {
        // top,center
        props() {
          return {
            cursor: 'ns-resize',
            style: {
              top: 0,
              left: '50%',
              translate: '-50% -50%',
            },
            onMove({ y }) {
              payload.updateMovedBoxState({
                y,
                top: y,
              })
            },
          }
        },
      },
      {
        // top,right
        props() {
          return {
            cursor: 'nesw-resize',
            style: {
              top: 0,
              right: 0,
              translate: '50% -50%',
            },
            onMove({ x, y }) {
              payload.updateMovedBoxState({
                y,
                top: y,
                right: x,
              })
            },
          }
        },
      },
      {
        // middle,right
        props() {
          return {
            cursor: 'ew-resize',
            style: {
              top: '50%',
              right: 0,
              translate: '50% -50%',
            },
            onMove({ x }) {
              payload.updateMovedBoxState({
                right: x,
              })
            },
          }
        },
      },
      {
        // bottom,right
        props() {
          return {
            cursor: 'nwse-resize',
            style: {
              bottom: 0,
              right: 0,
              translate: '50% 50%',
            },
            onMove({ x, y }) {
              payload.updateMovedBoxState({
                right: x,
                bottom: y,
              })
            },
          }
        },
      },
      {
        // bottom,center
        props() {
          return {
            cursor: 'ns-resize',
            style: {
              bottom: 0,
              left: '50%',
              translate: '-50% 50%',
            },
            onMove({ y }) {
              payload.updateMovedBoxState({
                bottom: y,
              })
            },
          }
        },
      },
      {
        // bottom,left
        props() {
          return {
            cursor: 'nesw-resize',
            style: {
              bottom: 0,
              left: 0,
              translate: '-50% 50%',
            },
            onMove({ x, y }) {
              payload.updateMovedBoxState({
                x,
                left: x,
                bottom: y,
              })
            },
          }
        },
      },
      {
        // middle,left
        props() {
          return {
            cursor: 'ew-resize',
            style: {
              top: '50%',
              left: 0,
              translate: '-50% -50%',
            },
            onMove({ x }) {
              payload.updateMovedBoxState({
                x,
                left: x,
              })
            },
          }
        },
      },
    ]
  }

  export function getBoxLayoutWithMinimums({
    boxState,
    movedBoxState,
  }: {
    boxState: BoundaryWithOffsetSchema
    movedBoxState: BoundaryWithOffsetSchema
  }): BoundingBoxSchema {
    const next: BoundaryWithOffsetSchema = {
      x: boxState.x + movedBoxState.x,
      y: boxState.y + movedBoxState.y,
      top: boxState.top + movedBoxState.top,
      right: boxState.right + movedBoxState.right,
      bottom: boxState.bottom + movedBoxState.bottom,
      left: boxState.left + movedBoxState.left,
    }

    let nextWidth = Math.abs(next.right - next.left)
    let nextHeight = Math.abs(next.bottom - next.top)

    const isBelowMinWidth = nextWidth < GuideBoxConst.MIN_WIDTH
    const isBelowMinHeight = nextHeight < GuideBoxConst.MIN_HEIGHT

    if (isBelowMinWidth) {
      const adjustValue = GuideBoxConst.MIN_WIDTH - nextWidth

      nextWidth = GuideBoxConst.MIN_WIDTH

      switch (true) {
        case movedBoxState.left > 0: {
          next.left -= adjustValue
          next.x -= adjustValue
          break
        }

        case movedBoxState.right < 0: {
          next.right += adjustValue
          break
        }
      }
    }

    if (isBelowMinHeight) {
      const adjustValue = GuideBoxConst.MIN_HEIGHT - nextHeight

      nextHeight = GuideBoxConst.MIN_HEIGHT

      switch (true) {
        case movedBoxState.top > 0: {
          next.top -= adjustValue
          next.y -= adjustValue
          break
        }

        case movedBoxState.bottom < 0: {
          next.bottom += adjustValue
          break
        }
      }
    }

    return {
      ...next,
      width: nextWidth,
      height: nextHeight,
    }
  }
}
