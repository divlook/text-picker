/**
 * 좌표
 *
 * - 예 : [x, y]
 */
export type Coordinate = [number, number]

export interface Offset {
    top: number
    left: number
    right: number
    bottom: number
}

export interface BlockNode {
    id: Symbol
    parentId?: Symbol
    el: Element
    childs: Map<Symbol, BlockNode>
}

export interface Outline {
    x: number
    y: number
    width: number
    height: number
}
