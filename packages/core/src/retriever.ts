import type { BoundarySchema } from '@/index.js'
import { RetrievedNode } from '@/retrieved-node.js'

export class Retriever {
  #cacheMap = new Map<string, RetrievedNode>()
  #events = new Set<(node: RetrievedNode) => void>()
  #retrieverTimeoutId?: number
  #expirationCheckTimeoutId?: number
  #lastExecutedTimestamp = 0
  #cacheDuration = 10 * 1000
  #throttleTime = Retriever.MIN_THROTTLE_TIME

  constructor(options?: {
    /**
     * @default 10sec
     */
    cacheDuration?: number
  }) {
    if (options?.cacheDuration && options.cacheDuration > 0) {
      this.#cacheDuration = options.cacheDuration
    }
  }

  clear() {
    this.off()
    this.#cacheMap.clear()
  }

  on(event: (node: RetrievedNode) => void) {
    this.#events.add(event)
  }

  off(event?: (node: RetrievedNode) => void) {
    if (typeof event === 'function') {
      this.#events.delete(event)
      return
    }

    this.#events.clear()
  }

  #emit(node: RetrievedNode) {
    for (const event of this.#events) {
      event(node)
    }
  }

  #clearExpiredCache() {
    clearTimeout(this.#expirationCheckTimeoutId)
    this.#expirationCheckTimeoutId = setTimeout(() => {
      const currentTimestamp = Date.now()

      for (const [key, item] of this.#cacheMap) {
        if (currentTimestamp - item.timestamp >= this.#cacheDuration) {
          this.#cacheMap.delete(key)
        }
      }
    }, 300)
  }

  retrieve(boundary: BoundarySchema): void {
    const cacheKey = JSON.stringify(boundary)
    const cached = this.#cacheMap.get(cacheKey)
    const isDebounceEnabled = this.#throttleTime >= Retriever.MAX_THROTTLE_TIME
    const collectElementsInBoundary = () => {
      this.#lastExecutedTimestamp = Date.now()

      if (
        cached &&
        this.#lastExecutedTimestamp - cached.timestamp < this.#cacheDuration &&
        cached.status === 'done'
      ) {
        this.#emit(cached)
        return
      }

      const visitedElements = new Set<Element>()
      const foundElements = new Set<Element>()

      const spacing = 10

      const node = new RetrievedNode({
        boundary,
      })

      this.#cacheMap.set(cacheKey, node)

      for (const el of document.querySelectorAll('[data-retriever-ignored]')) {
        for (const innerElement of el.querySelectorAll('*')) {
          visitedElements.add(innerElement)
        }

        visitedElements.add(el)
      }

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
            let retrievedCount = 0

            if (rect.top >= boundary.top) retrievedCount++
            if (rect.bottom <= boundary.bottom) retrievedCount++
            if (rect.left >= boundary.left) retrievedCount++
            if (rect.right <= boundary.right) retrievedCount++

            if (retrievedCount >= 3) {
              foundElements.add(el)
            }
          }
        }
      }

      node.create(Array.from(foundElements))
      this.#cacheMap.set(cacheKey, node)
      this.#emit(node)
      this.#clearExpiredCache()
    }

    clearTimeout(this.#retrieverTimeoutId)

    if (
      isDebounceEnabled ||
      Date.now() - this.#lastExecutedTimestamp < this.#throttleTime
    ) {
      this.#throttleTime = this.#calculateThrottleTime(boundary)
      this.#retrieverTimeoutId = setTimeout(() => {
        collectElementsInBoundary()
      }, this.#throttleTime)
      return
    }

    if (isDebounceEnabled) {
      return
    }

    collectElementsInBoundary()
  }

  #calculateThrottleTime(boundary: BoundarySchema): number {
    const boundaryAreaSize =
      (boundary.right - boundary.left) * (boundary.bottom - boundary.top)

    return Math.max(
      Retriever.MIN_THROTTLE_TIME,
      Math.min(
        Retriever.MAX_THROTTLE_TIME,
        Math.round(boundaryAreaSize / 1000),
      ),
    )
  }

  static get MIN_THROTTLE_TIME() {
    return 50
  }

  static get MAX_THROTTLE_TIME() {
    return 500
  }
}
