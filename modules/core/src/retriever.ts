import type { BoundarySchema, BoundingBoxSchema } from '@/index.js'
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

  retrieve(boundary: BoundingBoxSchema): void {
    const cacheKey = JSON.stringify({
      boundary,
      scroll: {
        x: window.scrollX,
        y: window.scrollY,
      },
    })
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

      const visitedElementSet = new Set<Element>()
      const uniqueElementSet = new Set<Element>()
      const foundElementSet = new Set<Element>()

      const spacing = 10

      const node = new RetrievedNode({
        boundary,
      })

      this.#cacheMap.set(cacheKey, node)

      for (const el of document.querySelectorAll('[data-retriever-ignored]')) {
        for (const innerElement of el.querySelectorAll('*')) {
          visitedElementSet.add(innerElement)
        }

        visitedElementSet.add(el)
      }

      // point에서 발견된 모든 요소를 uniqueElementSet에 추가
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

          elements.forEach((el) => {
            if (visitedElementSet.has(el) || uniqueElementSet.has(el)) {
              return
            }

            uniqueElementSet.add(el)
          })
        }
      }

      // uniqueElementSet에 있는 요소 중 boundary 안에 있는 요소만 찾아서 foundElements에 추가
      for (const el of uniqueElementSet) {
        if (visitedElementSet.has(el)) {
          continue
        }

        visitedElementSet.add(el)

        const rect = el.getBoundingClientRect()
        let retrievedCount = 0

        if (rect.top >= boundary.top) retrievedCount++
        if (rect.bottom <= boundary.bottom) retrievedCount++
        if (rect.left >= boundary.left) retrievedCount++
        if (rect.right <= boundary.right) retrievedCount++

        if (retrievedCount >= 3) {
          foundElementSet.add(el)
        }
      }

      // foundElementSet에 있는 요소 중 부모 요소가 포함하는 자식 요소는 제거
      foundElementSet.forEach((parentEl) => {
        // 이미 제거된 요소는 제외
        if (!foundElementSet.has(parentEl)) {
          return
        }

        // 부모 요소가 포함하는 자식 요소를 찾아서 foundElementSet에서 제거
        foundElementSet.forEach((childEl) => {
          if (parentEl === childEl || !parentEl.contains(childEl)) {
            return
          }

          // 부모 요소가 포함하는 자식 요소는 제거
          foundElementSet.delete(childEl)
        })
      })

      node.create([...foundElementSet])
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
