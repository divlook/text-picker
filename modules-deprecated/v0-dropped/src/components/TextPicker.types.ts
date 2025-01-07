import { Outline } from '~/libs/global/types'

export interface Props {
    blocks?: Outline[]
    running?: boolean
    hidden?: boolean
    onUpdateRunning?(running: boolean): void
    onMove?(outline: Outline): void
    onBlockClick?(outline: Outline, index: number): void
}

export interface State {
    isRunning: boolean
    zIndex: number
}
