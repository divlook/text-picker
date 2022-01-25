import { css } from '~/emotion'
import { Offset, Outline } from '~/interfaces'
import { azure_radiance_1441 } from '~/palette'
import { rgb } from '~/utils'

export class BlockParser {
    static getContent(el: HTMLElement) {
        const cloneEl = el.cloneNode(true) as HTMLElement

        Array.from(cloneEl.querySelectorAll('img')).forEach((img) => {
            const span = document.createElement('span')

            if (img.alt) {
                span.textContent = `image(${img.alt})`

                img.parentElement?.replaceChild(span, img)
            }
        })

        return (cloneEl.textContent || '')
            .split('\n')
            .reduce((resultText, row) => {
                const rowText = row.trim().replaceAll(/\s+/g, ' ')

                if (!resultText) {
                    return rowText
                }

                if (rowText) {
                    resultText += '\n'
                    resultText += rowText
                }

                return resultText
            }, '')
    }

    /**
     * Get z-index
     *
     * `position`이 'static'이 아닌 요소, 즉 'relative', 'absolute', 'fixed', 'sticky'의 z-index를 가져옴
     */
    static getZIndex(el: HTMLElement): number {
        const style = window.getComputedStyle(el)

        const zIndex = parseInt(style.zIndex) || 0
        const position = style.position

        if (style.display !== 'none' && position === 'static') {
            const children = Array.from(el.children) as HTMLElement[]

            return children.reduce((zIndex, child) => {
                return Math.max(zIndex, BlockParser.getZIndex(child))
            }, 0)
        }

        return zIndex
    }

    rootElement

    blockMap = new Map<Symbol, BlockParser.BlockNode>()

    blockMapByElement = new Map<HTMLElement, BlockParser.BlockNode>()

    offsetMap = new Map<Symbol, Offset>()

    selectedBlockIdSet: Set<Symbol> = new Set()

    selectedContents: string[] = []

    ignoreElementSet = new Set<HTMLElement>()

    constructor(rootElement: HTMLElement, options: BlockParser.Options = {}) {
        this.rootElement = rootElement

        this.ignoreElementSet.clear()

        if (options.ignoreElements) {
            this.ignoreElementSet = new Set(options.ignoreElements)
        }

        this.parse(rootElement)
    }

    private parse(el: HTMLElement) {
        const cachedBlock = this.blockMapByElement.get(el)

        if (cachedBlock) {
            return cachedBlock
        }

        const id = Symbol()

        const childs: Map<Symbol, BlockParser.BlockNode> = new Map()

        const block: BlockParser.BlockNode = {
            id,
            el,
            childs,
        }

        this.blockMap.set(block.id, block)

        this.blockMapByElement.set(el, block)

        this.parseOffset(block)

        for (const child of Array.from(el.children) as HTMLElement[]) {
            const childBlock = this.parse(child)

            childBlock.parentId = block.id
            block.childs.set(childBlock.id, childBlock)
        }

        return block
    }

    private parseOffset(block: BlockParser.BlockNode) {
        const { top, bottom, left, right } = block.el.getBoundingClientRect()

        const offset: Offset = {
            top,
            bottom,
            left,
            right,
        }

        this.offsetMap.set(block.id, offset)
    }

    reparseOffsetAllBlock() {
        this.blockMap.forEach((block) => {
            this.parseOffset(block)
        })
    }

    claer() {
        this.unselect()
        this.blockMap.clear()
        this.offsetMap.clear()
    }

    unselect() {
        this.selectedBlockIdSet.forEach((id) => {
            const block = this.blockMap.get(id)

            if (block) {
                block.el.classList.remove(BlockParser.styles.active)
            }
        })

        this.selectedBlockIdSet.clear()
        this.selectedContents.splice(0, this.selectedContents.length)
    }

    select(outline: Outline) {
        this.unselect()

        const startX = outline.x
        const endX = startX + outline.width
        const startY = outline.y
        const endY = startY + outline.height

        const root = this.blockMapByElement.get(this.rootElement)

        let arr = Array.from(root?.childs.values() || [])

        while (arr.length) {
            const nextArr: BlockParser.BlockNode[] = []

            for (const block of arr) {
                const { parentId } = block

                if (this.isIgnoreElement(block.el)) {
                    this.blockMap.delete(block.id)
                    this.blockMapByElement.delete(block.el)
                    this.offsetMap.delete(block.id)
                    continue
                }

                if (parentId && this.selectedBlockIdSet.has(parentId)) {
                    continue
                }

                const offset = this.offsetMap.get(block.id)

                if (offset) {
                    const { left, right, top, bottom } = offset
                    let hitCount = 0

                    if (left >= startX) hitCount++
                    if (right <= endX) hitCount++
                    if (top >= startY) hitCount++
                    if (bottom <= endY) hitCount++

                    if (hitCount > 3) {
                        const content = BlockParser.getContent(block.el)

                        if (content) {
                            block.el.classList.add(BlockParser.styles.active)
                            this.selectedBlockIdSet.add(block.id)
                            this.selectedContents.push(content)
                        }
                        continue
                    }

                    nextArr.push(...Array.from(block.childs.values()))
                }
            }

            arr = nextArr
        }
    }

    toString() {
        return this.selectedContents.join('\n\n')
    }

    isIgnoreElement(el: HTMLElement) {
        return this.ignoreElementSet.has(el)
    }
}

export namespace BlockParser {
    export interface Options {
        ignoreElements?: HTMLElement[]
    }

    export interface BlockNode {
        id: Symbol
        parentId?: Symbol
        el: HTMLElement
        childs: Map<Symbol, BlockNode>
    }
    export namespace styles {
        export const active = css`
            background-color: ${rgb(azure_radiance_1441, 20)} !important;
            outline-style: solid !important;
            outline-color: ${rgb(azure_radiance_1441)} !important;
            outline-width: 1px !important;
            outline-offset: -1px !important;
        `
    }
}
