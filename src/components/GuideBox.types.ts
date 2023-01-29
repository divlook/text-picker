import { Coordinate, Outline } from '~/libs/global/types'

export interface Props {
    coordinates?: Coordinate[]
    zIndex?: number
    throttleTime?: number
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
