import type { BoundarySchema } from '@/index.js'

export class ExtractText {
  private cache: {
    boundary: BoundarySchema
    elements: Element[]
    timestamp: number
  }[] = []
  private cacheDuration = 10 * 1000
  private throttleDuration = 1000
  private lastExecution = 0
  private lastArgs: BoundarySchema | null = null
  private timeoutId: number | null = null

  parse(boundary: BoundarySchema) {
    const now = Date.now()

    const cachedItem = this.cache.find(
      (item) =>
        now - item.timestamp < this.cacheDuration &&
        this.isSameBoundary(item.boundary, boundary),
    )

    if (cachedItem) {
      return cachedItem.elements
    }

    const visitedElements = new Set<Element>()
    const foundElements = new Set<Element>()

    const spacing = 10

    for (
      let y = boundary.top + spacing;
      y <= boundary.bottom - spacing;
      y += spacing
    ) {
      for (
        let x = boundary.left + spacing;
        x <= boundary.right - spacing;
        x += spacing
      ) {
        const elements = document.elementsFromPoint(x, y)

        elements.splice(elements.length - 2, 2)

        for (let i = elements.length - 1; i >= 0; i--) {
          const el = elements[i]

          let isContained = false

          if (visitedElements.has(el)) {
            continue
          }

          visitedElements.add(el)

          for (const foundEl of foundElements) {
            if (foundEl.contains(el)) {
              isContained = true
              break
            }
          }

          if (isContained) {
            continue
          }

          const rect = el.getBoundingClientRect()

          if (
            rect.top >= boundary.top &&
            rect.bottom <= boundary.bottom &&
            rect.left >= boundary.left &&
            rect.right <= boundary.right
          ) {
            foundElements.add(el)
          }
        }
      }
    }

    const elementsArray = Array.from(foundElements)

    this.cache.push({
      boundary,
      elements: elementsArray,
      timestamp: now,
    })

    this.cache = this.cache.filter(
      (item) => now - item.timestamp < this.cacheDuration,
    )

    return elementsArray
  }

  parseWithThrottle(boundary: BoundarySchema) {
    const now = Date.now()
    this.lastArgs = boundary

    if (now - this.lastExecution < this.throttleDuration) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
      }
      this.timeoutId = window.setTimeout(
        () => {
          this.lastExecution = Date.now()

          if (this.lastArgs) {
            this.parse(this.lastArgs)
          }
        },
        this.throttleDuration - (now - this.lastExecution),
      )
      return []
    }

    this.lastExecution = now

    return this.parse(boundary)
  }

  clear() {
    this.cache = []
    this.lastExecution = 0
    this.lastArgs = null
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }

  private isSameBoundary(
    boundary1: BoundarySchema,
    boundary2: BoundarySchema,
  ): boolean {
    return (
      boundary1.top === boundary2.top &&
      boundary1.bottom === boundary2.bottom &&
      boundary1.left === boundary2.left &&
      boundary1.right === boundary2.right
    )
  }
}
