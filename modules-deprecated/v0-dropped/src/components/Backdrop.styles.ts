import { css } from '~/libs/emotion'
import { black } from '~/libs/palette'
import { rgb } from '~/libs/utils'

export const container = css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${rgb(black, 40)};
    opacity: 0;
    transition: opacity 0.5s;
    display: none;
`

export const displayed = css`
    display: block !important;
`

export const visiabled = css`
    opacity: 1 !important;
`
