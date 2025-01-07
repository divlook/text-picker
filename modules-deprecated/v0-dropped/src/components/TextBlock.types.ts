import { Outline } from '~/libs/global/types'

export interface Props {
    outline: Outline
    hidden?: boolean
    zIndex?: number
    onClick?(outline: Outline): void
}
