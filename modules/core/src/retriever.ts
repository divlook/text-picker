import type { BoundarySchema, BoundingBoxSchema } from '@/index.js'

export type RetrievalResult = {
  readonly elements: readonly Element[]
  readonly rects: readonly BoundarySchema[]
  readonly text: string
}

type Coordinates = {
  x: number
  y: number
  scaleX: number
  scaleY: number
}

const ROOT_COORDINATES: Coordinates = { x: 0, y: 0, scaleX: 1, scaleY: 1 }

export class Retriever {
  #events = new Set<(result: RetrievalResult) => void>()
  #timeoutId?: number
  #lastExecutedTimestamp = 0
  #throttleTime = 50

  on(event: (result: RetrievalResult) => void) {
    this.#events.add(event)
    return () => this.#events.delete(event)
  }

  clear() {
    clearTimeout(this.#timeoutId)
    this.#timeoutId = undefined
    this.#events.clear()
    this.#lastExecutedTimestamp = 0
    this.#throttleTime = 50
  }

  retrieve(boundary: BoundingBoxSchema): void {
    clearTimeout(this.#timeoutId)
    if (
      this.#throttleTime >= 500 ||
      Date.now() - this.#lastExecutedTimestamp < this.#throttleTime
    ) {
      const area =
        (boundary.right - boundary.left) * (boundary.bottom - boundary.top)
      this.#throttleTime = Math.max(50, Math.min(500, Math.round(area / 1000)))
      this.#timeoutId = window.setTimeout(
        () => this.retrieveNow(boundary),
        this.#throttleTime,
      )
      return
    }
    this.retrieveNow(boundary)
  }

  // Synchronous so a copy button can write to the clipboard during user activation.
  retrieveNow(boundary: BoundingBoxSchema): RetrievalResult {
    clearTimeout(this.#timeoutId)
    this.#timeoutId = undefined
    this.#lastExecutedTimestamp = Date.now()
    const candidates = new Map<Element, Coordinates>()

    const collectFromPoint = (
      doc: Document,
      x: number,
      y: number,
      coordinates: Coordinates,
    ) => {
      for (const el of doc.elementsFromPoint(x, y)) {
        if (
          el.tagName === 'HTML' ||
          el.tagName === 'BODY' ||
          el.closest('[data-retriever-ignored]')
        ) {
          continue
        }
        if (el.tagName === 'IFRAME') {
          const iframe = el as HTMLIFrameElement
          let frameDocument: Document | undefined
          try {
            frameDocument = iframe.contentWindow?.document
          } catch (error) {
            if (error instanceof DOMException && error.name === 'SecurityError')
              continue
            throw error
          }
          if (!frameDocument) continue
          const rect = iframe.getBoundingClientRect()
          const scaleX = rect.width / iframe.offsetWidth
          const scaleY = rect.height / iframe.offsetHeight
          if (!scaleX || !scaleY) continue
          const style = window.getComputedStyle(iframe)
          const left =
            rect.left +
            (iframe.clientLeft + Number.parseFloat(style.paddingLeft)) * scaleX
          const top =
            rect.top +
            (iframe.clientTop + Number.parseFloat(style.paddingTop)) * scaleY
          collectFromPoint(
            frameDocument,
            (x - left) / scaleX,
            (y - top) / scaleY,
            {
              x: coordinates.x + left * coordinates.scaleX,
              y: coordinates.y + top * coordinates.scaleY,
              scaleX: coordinates.scaleX * scaleX,
              scaleY: coordinates.scaleY * scaleY,
            },
          )
        } else {
          candidates.set(el, coordinates)
        }
      }
    }

    for (let y = boundary.top + 10; y <= boundary.bottom - 10; y += 10) {
      for (let x = boundary.left + 10; x <= boundary.right - 10; x += 10) {
        collectFromPoint(document, x, y, ROOT_COORDINATES)
      }
    }

    const found = new Map<Element, BoundarySchema>()
    for (const [el, coordinates] of candidates) {
      const rect = el.getBoundingClientRect()
      const style = window.getComputedStyle(el)
      const bounds = {
        top: coordinates.y + rect.top * coordinates.scaleY,
        right: coordinates.x + rect.right * coordinates.scaleX,
        bottom: coordinates.y + rect.bottom * coordinates.scaleY,
        left: coordinates.x + rect.left * coordinates.scaleX,
      }
      let containedSides = 0
      if (
        bounds.top + Number.parseFloat(style.paddingTop) * coordinates.scaleY >=
        boundary.top
      )
        containedSides++
      if (
        bounds.bottom -
          Number.parseFloat(style.paddingBottom) * coordinates.scaleY <=
        boundary.bottom
      )
        containedSides++
      if (
        bounds.left +
          Number.parseFloat(style.paddingLeft) * coordinates.scaleX >=
        boundary.left
      )
        containedSides++
      if (
        bounds.right -
          Number.parseFloat(style.paddingRight) * coordinates.scaleX <=
        boundary.right
      )
        containedSides++
      if (containedSides >= 3) found.set(el, bounds)
    }

    for (const parent of found.keys()) {
      for (const child of found.keys()) {
        if (parent !== child && parent.contains(child)) found.delete(child)
      }
    }

    const elements = [...found.keys()]
    let text = ''
    for (let index = 0; index < elements.length; index++) {
      if (index > 0) text += getSeparator(elements[index - 1], elements[index])
      text += getText(elements[index])
    }
    const result: RetrievalResult = {
      elements,
      rects: [...found.values()],
      text: text
        .replace(/[\t ]*\n[\t ]*/g, '\n')
        .replace(/\u200b/g, '')
        .trim(),
    }
    for (const event of this.#events) event(result)
    return result
  }
}

function getText(element: Element): string {
  if (element.tagName === 'BR') return '\n'
  if (element.tagName === 'IMG') {
    return `![${element.getAttribute('alt') || 'image'}](${element.getAttribute('src') || ''})`
  }
  let text = ''
  for (const node of element.childNodes) {
    if (node.nodeType === 3) {
      text += node.textContent?.replace(/\s+/g, ' ') || ''
    } else if (node.nodeType === 1) {
      const el = node as Element
      const next = getText(el)
      if (!next) continue
      const display = window.getComputedStyle(el).display
      const isBlock =
        el.tagName !== 'BR' &&
        !display.includes('inline') &&
        display !== 'contents'
      if (isBlock && text && !text.endsWith('\n')) text += '\n'
      text += next
      if (isBlock && !text.endsWith('\n')) text += '\n'
    }
  }
  return text
}

function getSeparator(previous: Element, next: Element): string {
  if (
    previous.ownerDocument !== next.ownerDocument ||
    !window.getComputedStyle(previous).display.includes('inline') ||
    !window.getComputedStyle(next).display.includes('inline') ||
    !(previous.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING)
  ) {
    return '\n'
  }
  const range = previous.ownerDocument.createRange()
  range.setStartAfter(previous)
  range.setEndBefore(next)
  if (range.toString().trim()) return '\n'
  const walker = previous.ownerDocument.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) =>
        range.intersectsNode(node)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT,
    },
  )
  let separator = ''
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeType === Node.TEXT_NODE) {
      separator += node.textContent?.replace(/\s+/g, ' ') || ''
    } else {
      const el = node as Element
      if (el.tagName === 'BR') separator += '\n'
      else {
        const display = window.getComputedStyle(el).display
        if (
          !display.includes('inline') &&
          display !== 'contents' &&
          !separator.endsWith('\n')
        )
          separator += '\n'
      }
    }
  }
  return separator
}
