import { type BoundingBoxSchema, pixel } from '@text-picker/core'
import type { CSSProperties } from 'react'

export namespace TextPickerFns {
  export function calculateControlPanelStyle({
    boxLayout,
    controlPanelEl,
  }: {
    boxLayout: BoundingBoxSchema | null
    controlPanelEl: React.RefObject<HTMLDivElement>
  }): CSSProperties {
    const style: CSSProperties = {}

    if (!boxLayout || !controlPanelEl.current) {
      return style
    }

    const controlPanelHeight = controlPanelEl.current.clientHeight
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const distance = 8

    style.top = pixel(boxLayout.bottom + distance)
    style.bottom = 'auto'
    style.left = 'auto'
    style.right = pixel(window.innerWidth - boxLayout.right)

    if (
      screenHeight * 0.75 <= boxLayout.top ||
      screenHeight <= boxLayout.bottom + distance * 2 + controlPanelHeight
    ) {
      style.top = 'auto'
      style.bottom = pixel(screenHeight - boxLayout.top + distance)
    }

    if (screenWidth <= boxLayout.right + distance) {
      style.left = pixel(boxLayout.left)
      style.right = 'auto'
    }

    return style
  }

  export function calculateToastStyle({
    boxLayout,
  }: {
    boxLayout: BoundingBoxSchema | null
  }) {
    const style: CSSProperties = {}

    if (!boxLayout) {
      return style
    }

    const distance = 16

    style.minWidth = pixel(200)
    style.bottom = 'auto'
    style.right = 'auto'
    style.left = pixel(boxLayout.left + boxLayout.width / 2)
    style.top = pixel(boxLayout.top + boxLayout.height)
    style.translate = `-50% calc(-100% - ${pixel(distance)})`

    return style
  }
}
