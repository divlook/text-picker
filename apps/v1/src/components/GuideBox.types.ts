import { Coordinate, Outline } from '~/libs/global/types'

export interface Props {
    coordinates?: Coordinate[]
    hidden?: boolean
    zIndex?: number
    throttleTime?: number
    onEnd?: () => void
    onUpdateOutline?(outline: Outline): void
}

export interface State {
    coordinates: Coordinate[]
    dragTargetEl: HTMLDivElement | null
    outline: Outline
    outlineAdjustPoint: Coordinate
    mode: Mode
}

export enum Mode {
    Default,
    Dragging,
}

export enum PointPosition {
    None = 'none',
    Inside = 'inside',
    Border = 'border',
    Outside = 'outside',
}
