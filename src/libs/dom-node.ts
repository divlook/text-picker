import { DOMReader } from '~/libs/dom-reader'
import { Offset } from '~/libs/global/types'

export class DOMNode {
    parentEl: HTMLElement | null
    insideElSet = new Set<HTMLElement>()
    offset: Offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    }

    get width() {
        return this.offset.right - this.offset.left
    }

    get height() {
        return this.offset.bottom - this.offset.top
    }

    get areaSize() {
        return this.width * this.height
    }

    constructor(public el: HTMLElement) {
        this.parentEl = el.parentElement
        this.calcOffset()
    }

    calcOffset() {
        const { top, bottom, left, right } = this.el.getBoundingClientRect()

        this.offset = {
            top: top + window.scrollY,
            bottom: bottom + window.scrollY,
            left: left + window.scrollX,
            right: right + window.scrollX,
        }
    }

    isInsideOf = (node: DOMNode) => {
        if (this.offset.bottom > node.offset.bottom) return false
        if (this.offset.top < node.offset.top) return false
        if (this.offset.left < node.offset.left) return false
        if (this.offset.right > node.offset.right) return false
        return true
    }

    isParentOf(target: HTMLElement) {
        return DOMReader.isParent(this.el, target)
    }

    isChildOf(target: HTMLElement) {
        return DOMReader.isParent(target, this.el)
    }
}
