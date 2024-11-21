import { DOMNode } from '~/libs/dom-node'
import { debounce } from '~/libs/utils'

/**
 * @see https://github.com/divlook/text-picker/blob/bcd0510cf21a658cb9f74176fea8c6ef575a80f6/src/libs/block-parser.ts
 */
export class DOMReader {
    static get errorCode() {
        return {
            NOT_INIT_OBSERVER: 'NOT_INIT_OBSERVER',
            INVALID_PARAMETER: 'INVALID_PARAMETER',
        } as const
    }

    static isDisplayed(el?: HTMLElement | null): el is HTMLElement {
        try {
            if (!el) return false

            return window.getComputedStyle(el).display !== 'none'
        } catch {
            return false
        }
    }

    static isParent(parent: HTMLElement, child: HTMLElement) {
        if (!parent || !child) {
            throw new Error(DOMReader.errorCode.INVALID_PARAMETER)
        }

        const els = Array.from(parent.children) as HTMLElement[]

        while (els.length > 0) {
            const el = els.shift()

            if (!!el) {
                if (child === el) {
                    return true
                }

                els.push(...(Array.from(el.children) as HTMLElement[]))
            }
        }

        return false
    }

    #observer: MutationObserver | null = null

    /**
     * key: el
     */
    #nodeMap = new Map<HTMLElement, DOMNode>()

    /**
     * key: parentEl
     */
    #elsMapByParent = new Map<HTMLElement, Set<HTMLElement>>()

    #ignoreElementSet: Set<HTMLElement>

    constructor(
        public targetEl: HTMLElement,
        ignoreElements: HTMLElement[] = [],
    ) {
        const els = Array.from(document.body.children) as HTMLElement[]

        this.#ignoreElementSet = new Set(ignoreElements)

        while (els.length > 0) {
            const el = els.shift()

            if (DOMReader.isDisplayed(el) && !this.#ignoreElementSet.has(el)) {
                this.#parseNode(el)
                els.push(...(Array.from(el.children) as HTMLElement[]))
            }
        }

        this.#observer = this.#watchTargetEl()
    }

    clear() {
        this.#getObserver().disconnect()

        this.#observer = null
        this.#nodeMap.clear()
        this.#elsMapByParent.clear()
    }

    #watchTargetEl() {
        this.#observer?.disconnect?.()

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                let el: HTMLElement | null = null

                switch (mutation.type) {
                    case 'characterData': {
                        el = mutation.target.parentElement
                        break
                    }

                    case 'attributes': {
                        el = mutation.target as HTMLElement
                        break
                    }

                    case 'childList': {
                        el = mutation.target as HTMLElement
                        break
                    }
                }

                if (el && !this.#ignoreElementSet.has(el)) {
                    this.#parseNode(el)
                }
            })
        })

        observer.observe(this.targetEl, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true,
        })

        return observer
    }

    #getObserver() {
        if (!this.#observer) {
            throw new Error(DOMReader.errorCode.NOT_INIT_OBSERVER)
        }

        return this.#observer
    }

    #parseNode(el: HTMLElement) {
        if (!el) return

        this.#removeNode(el)

        if (!DOMReader.isDisplayed(el)) return

        const node = new DOMNode(el)

        this.#nodeMap.set(el, node)

        if (node.parentEl) {
            const nearbyElSet =
                this.#elsMapByParent.get(node.parentEl) ?? new Set()

            nearbyElSet.add(el)
            this.#elsMapByParent.set(node.parentEl, nearbyElSet)
        }

        this.#buildNodeTree()
    }

    #removeNode(el: HTMLElement) {
        const node = this.#nodeMap.get(el)
        const childElSet = this.#elsMapByParent.get(el)

        if (childElSet) {
            childElSet.forEach((el) => {
                this.#removeNode(el)
            })
        }

        if (node && node.parentEl) {
            const nearbyElSet =
                this.#elsMapByParent.get(node.parentEl) ?? new Set()

            nearbyElSet.delete(el)

            if (nearbyElSet.size === 0) {
                this.#elsMapByParent.delete(node.parentEl)
            }

            this.#nodeMap.delete(el)
        }
    }

    #buildNodeTree = debounce(100, () => {
        const nodes = Array.from(this.#nodeMap.values())

        nodes.sort((a, b) => {
            a.insideElSet.clear()
            b.insideElSet.clear()

            return a.areaSize - b.areaSize
        })

        for (let i = 0; i < nodes.length - 1; i++) {
            const current = nodes[i]

            for (let j = i + 1; j < nodes.length; j++) {
                const next = nodes[j]

                if (current.isInsideOf(next)) {
                    next.insideElSet.add(current.el)
                    break
                }
            }
        }
    })
}
