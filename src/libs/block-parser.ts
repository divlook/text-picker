import { css } from '~/libs/emotion'
import { Offset, Outline } from '~/interfaces'
import { azure_radiance_1441 } from '~/libs/palette'
import { rgb } from '~/libs/utils'

export class BlockParser {
    static getContent(el: HTMLElement) {
        const cloneEl = el.cloneNode(true) as HTMLElement
        const imageElements: HTMLImageElement[] = []

        if (cloneEl.tagName.toUpperCase() === 'IMG') {
            imageElements.push(cloneEl as HTMLImageElement)
        }

        imageElements.push(...Array.from(cloneEl.querySelectorAll('img')))

        imageElements.forEach((img) => {
            if (img.alt) {
                img.textContent = `image(${img.alt})`
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
        this.parseTree()
    }

    private parse(el: HTMLElement) {
        const cachedBlock = this.blockMapByElement.get(el)

        if (cachedBlock) {
            return cachedBlock
        }

        if (window.getComputedStyle(el).display === 'none') {
            return
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
            this.parse(child)
        }

        return block
    }

    private parseOffset(block: BlockParser.BlockNode) {
        const { top, bottom, left, right } = block.el.getBoundingClientRect()

        const offset: Offset = {
            top: top + window.scrollY,
            bottom: bottom + window.scrollY,
            left: left + window.scrollX,
            right: right + window.scrollX,
        }

        this.offsetMap.set(block.id, offset)
    }

    private parseTree() {
        const all = Array.from(this.offsetMap)
        const getSize = (offset: Offset) => {
            return (offset.right - offset.left) * (offset.bottom - offset.top)
        }
        const isInside = (a: Offset, b: Offset) => {
            if (a.bottom > b.bottom) return false
            if (a.top < b.top) return false
            if (a.left < b.left) return false
            if (a.right > b.right) return false
            return true
        }
        const getBlock = (id: Symbol) => {
            return this.blockMap.get(id)
        }

        all.sort(([, a], [, b]) => getSize(a) - getSize(b))

        for (let i = 0; i < all.length - 1; i++) {
            const [id, offset] = all[i]

            for (let j = i + 1; j < all.length; j++) {
                const [nextId, nextOffset] = all[j]

                if (isInside(offset, nextOffset)) {
                    const block = getBlock(id)
                    const parentBlock = getBlock(nextId)

                    // block이 없으면 정지
                    if (!block) break

                    // parentBlock이 없으면 넘김
                    if (!parentBlock) continue

                    parentBlock.childs.set(id, block)
                    block.parentId = nextId

                    break
                }
            }
        }
    }

    reparseOffsetAllBlock() {
        this.blockMap.forEach((block) => {
            this.parseOffset(block)
        })
        this.parseTree()
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
                    let xHitCount = 0
                    let yHitCount = 0

                    if (startX <= left && left <= endX) xHitCount++
                    if (startX <= right && right <= endX) xHitCount++
                    if (startY <= top && top <= endY) yHitCount++
                    if (startY <= bottom && bottom <= endY) yHitCount++

                    if (xHitCount + yHitCount >= 3) {
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
