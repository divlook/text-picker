import { css } from '~/libs/emotion'
import { azure_radiance_1441 } from '~/libs/palette'
import { rgb } from '~/libs/utils'

export const block = css`
    position: absolute;
    background-color: ${rgb(azure_radiance_1441, 20)} !important;
    outline-style: solid !important;
    outline-color: ${rgb(azure_radiance_1441)} !important;
    outline-width: 1px !important;
    outline-offset: -1px !important;
`
