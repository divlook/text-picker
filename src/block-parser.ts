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
    static isInlineElement(el: Element) {
        return window.getComputedStyle(el)?.display?.includes?.('inline')
    }

    static getContent(el: Element) {
        const cloneEl = el.cloneNode(true) as Element

        Array.from(cloneEl.querySelectorAll('img')).forEach((img) => {
            const span = document.createElement('span')

            span.textContent = img.alt

            img.parentElement?.replaceChild(span, img)
        })

        return cloneEl.textContent
            ?.split('\n')
            .map((row) => row.trim())
            .join('')
    }

    blockMap = new Map<Symbol, BlockNode>()

    offsetMap = new Map<Symbol, Offset>()

    selectedBlocks: BlockNode[] = []

    constructor(root: Element) {
        if (BlockParser.isInlineElement(root)) {
            return
        }

        const block = this.parse(root)

        this.blockMap.set(block.id, block)

        this.parseOffset(block)
    }

    private parse(el: Element): BlockNode {
        const id = Symbol()
        const childs: Map<Symbol, BlockNode> = new Map()

        for (const child of Array.from(el.children)) {
            if (BlockParser.isInlineElement(child)) {
                continue
            }

            const childBlock = this.parse(child)

            childBlock.parentId = id

            childs.set(childBlock.id, childBlock)

            this.parseOffset(childBlock)
        }

        return {
            id,
            el,
            childs,
        }
    }

    private parseOffset(node: BlockNode) {
        const offset: Offset = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }

        const parentBlock = node.parentId && this.blockMap.get(node.parentId)

        if (parentBlock) {
            const parentEl = parentBlock.el as HTMLElement

            offset.top += parentEl.offsetTop
            offset.left += parentEl.offsetLeft
        }

        const currentEl = node.el as HTMLElement

        offset.top += currentEl.offsetTop
        offset.bottom += offset.top + currentEl.clientHeight
        offset.left += currentEl.offsetLeft
        offset.right += offset.left + currentEl.clientWidth

        this.offsetMap.set(node.id, offset)
    }

    claer() {
        this.unselect()
        this.blockMap.clear()
        this.offsetMap.clear()
    }

    unselect() {
        for (const block of this.selectedBlocks) {
            block.el.classList.remove(activeStyle)
        }

        this.selectedBlocks.splice(0, this.selectedBlocks.length)
    }

    select(outline: Outline) {
        this.unselect()

        const startX = outline.x
        const endX = startX + outline.width
        const startY = outline.y
        const endY = startY + outline.height

        let arr = Array.from(this.blockMap.values())

        while (arr.length) {
            const nextArr: BlockNode[] = []

            for (const block of arr) {
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
                            // TODO: 이걸 복사할 수 있게 해줘야됨
                            console.log(content)

                            block.el.classList.add(activeStyle)
                            this.selectedBlocks.push(block)
                        }
                        continue
                    }

                    nextArr.push(...Array.from(block.childs.values()))
                }
            }

            arr = nextArr
        }
    }
}
