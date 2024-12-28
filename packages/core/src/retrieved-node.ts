import type { BoundarySchema } from '@/index.js'

export class RetrievedNode {
  #boundary: BoundarySchema
  #elements: Element[] = []
  #timestamp = Date.now()
  #status: 'pending' | 'done' = 'pending'

  constructor(options: {
    boundary: BoundarySchema
    elements?: Element[]
  }) {
    this.#boundary = options.boundary

    if (options.elements) {
      this.#elements.push(...options.elements)
      this.#status = 'done'
    }
  }

  get boundary() {
    return this.#boundary
  }

  get elements() {
    return this.#elements
  }

  get timestamp() {
    return this.#timestamp
  }

  get status() {
    return this.#status
  }

  create(elements: Element[]) {
    if (this.#status === 'done') {
      return this
    }

    this.#elements.push(...elements)
    this.#status = 'done'

    return this
  }

  async copyText(): Promise<RetrievedNode.CopyTextResult> {
    try {
      const text = this.#elements
        .map((el) => this.getTextWithLineBreaks(el))
        .join('\n')
        .replace(/​/g, '')

      if (!text) {
        return RetrievedNode.createCopyResult(
          'NO_TEXT_SELECTED',
          'No text selected',
        )
      }

      if (
        window.location.protocol !== 'https:' &&
        window.location.hostname !== 'localhost'
      ) {
        return RetrievedNode.createCopyResult(
          'HTTPS_REQUIRED',
          'Failed to copy text: Clipboard API requires HTTPS',
        )
      }

      await navigator.clipboard.writeText(text)
      return RetrievedNode.createCopyResult(
        'SUCCESS',
        'Text copied successfully',
      )
    } catch (err) {
      return RetrievedNode.handleCopyError(err)
    }
  }

  getTextWithLineBreaks(element: Element): string {
    let text = ''

    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element

        if (el.tagName.toLowerCase() === 'img') {
          const alt = el.getAttribute('alt') || 'image'
          const src = el.getAttribute('src') || ''

          text += `![${alt}](${src})`
        } else {
          text += this.getTextWithLineBreaks(el)
        }

        if (window.getComputedStyle(el).display !== 'inline') {
          text += '\n'
        }
      }
    }

    return text
  }

  static createCopyResult(
    code: RetrievedNode.CopyTextResult['code'],
    message: string,
  ): RetrievedNode.CopyTextResult {
    return { code, message }
  }

  static handleCopyError(err: unknown): RetrievedNode.CopyTextResult {
    if (err instanceof DOMException) {
      switch (err.name) {
        case 'NotAllowedError':
          return RetrievedNode.createCopyResult(
            'PERMISSION_DENIED',
            `Failed to copy text: Permission denied`,
          )
        case 'NotSupportedError':
          return RetrievedNode.createCopyResult(
            'NOT_SUPPORTED',
            `Failed to copy text: Clipboard API not supported`,
          )
        default:
          return RetrievedNode.createCopyResult(
            'DOM_EXCEPTION',
            `Failed to copy text: ${err.message}`,
          )
      }
    }

    return RetrievedNode.createCopyResult(
      'UNKNOWN_ERROR',
      `Failed to copy text: ${err}`,
    )
  }
}

export namespace RetrievedNode {
  export type CopyTextResult =
    | { code: 'NO_TEXT_SELECTED'; message: string }
    | { code: 'SUCCESS'; message: string }
    | { code: 'PERMISSION_DENIED'; message: string }
    | { code: 'NOT_SUPPORTED'; message: string }
    | { code: 'DOM_EXCEPTION'; message: string }
    | { code: 'HTTPS_REQUIRED'; message: string }
    | { code: 'UNKNOWN_ERROR'; message: string }
}
