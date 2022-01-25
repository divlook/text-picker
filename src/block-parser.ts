import { css } from '~/emotion'
import { BlockNode, Offset, Outline } from '~/interfaces'

const activeStyle = css`
    background-color: rgb(0 164 255 / 20%) !important;
    outline-style: solid !important;
    outline-color: rgb(0 164 255) !important;
    outline-width: 1px !important;
    outline-offset: -1px !important;
`

export class BlockParser {
    static isInlineElement(el: HTMLElement) {
        return window.getComputedStyle(el)?.display?.includes?.('inline')
    }

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
                const rowText = row.trim()

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

    blockMap = new Map<Symbol, BlockNode>()

    blockMapByElement = new Map<HTMLElement, BlockNode>()

    offsetMap = new Map<Symbol, Offset>()

    selectedBlockIdSet: Set<Symbol> = new Set()

    selectedContents: string[] = []

    constructor(root: HTMLElement) {
        this.rootElement = root

        if (BlockParser.isInlineElement(root)) {
            return
        }

        this.parse(root)
    }

    private parse(el: HTMLElement) {
        const cachedBlock = this.blockMapByElement.get(el)

        if (cachedBlock) {
            return cachedBlock
        }

        const id = Symbol()

        const childs: Map<Symbol, BlockNode> = new Map()

        const block: BlockNode = {
            id,
            el,
            childs,
        }

        this.blockMap.set(block.id, block)

        this.blockMapByElement.set(el, block)

        this.parseOffset(block)

        for (const child of Array.from(el.children) as HTMLElement[]) {
            if (BlockParser.isInlineElement(child)) {
                continue
            }

            const childBlock = this.parse(child)

            childBlock.parentId = block.id
            block.childs.set(childBlock.id, childBlock)
        }

        return block
    }

    private parseOffset(block: BlockNode) {
        const { top, bottom, left, right } = block.el.getBoundingClientRect()

        const offset: Offset = {
            top,
            bottom,
            left,
            right,
        }

        this.offsetMap.set(block.id, offset)
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
                block.el.classList.remove(activeStyle)
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
            const nextArr: BlockNode[] = []

            for (const block of arr) {
                const { parentId } = block

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
                            block.el.classList.add(activeStyle)
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
}
