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

export interface Outline {
    x: number
    y: number
    width: number
    height: number
}

export interface MicroElementEmitMethod {
    (eventName: 'created'): void
    (eventName: 'mounted'): void
    (eventName: string): void
}

export interface MicroElementOnMethod {
    (eventName: 'created', callback: () => void): void
    (eventName: 'mounted', callback: () => void): void
    (eventName: string, callback: () => void): void
}

export interface MicroElementOffMethod {
    (eventName?: 'created', callback?: () => void): void
    (eventName?: 'mounted', callback?: () => void): void
    (eventName?: string, callback?: () => void): void
}

export type MicroElementClassesArg =
    | string
    | string[]
    | Record<string, any>
    | Record<string, any>[]
