import { css } from '~/libs/emotion'
import { dodger_blue } from '~/libs/palette'
import { rgb } from '~/libs/utils'

export const container = css`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10000;
    border-width: 2px;
    border-color: ${rgb(dodger_blue)};
    border-style: dashed;
    width: 0;
    height: 0;
    transform: translate(0, 10px);
    box-sizing: border-box;
    cursor: move;
    display: none;
`

export const hidden = css`
    display: none !important;
`

export const activated = css`
    display: block;
`

export const crosshair = css`
    cursor: crosshair;
`

export const point = css`
    position: absolute;
    cursor: grab;
    width: 10px;
    height: 10px;
    background-color: ${rgb(dodger_blue)};
`

export const pointTop = css`
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    cursor: ns-resize;
`

export const pointBottom = css`
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    cursor: ns-resize;
`

export const pointLeft = css`
    top: 50%;
    left: -6px;
    transform: translateY(-50%);
    cursor: ew-resize;
`

export const pointRight = css`
    top: 50%;
    right: -6px;
    transform: translateY(-50%);
    cursor: ew-resize;
`

export const pointTopLeft = css`
    top: -6px;
    left: -6px;
    cursor: nwse-resize;
`

export const pointTopRight = css`
    top: -6px;
    right: -6px;
    cursor: nesw-resize;
`

export const pointBottomLeft = css`
    bottom: -6px;
    left: -6px;
    cursor: nesw-resize;
`

export const pointBottomRight = css`
    bottom: -6px;
    right: -6px;
    cursor: nwse-resize;
`

// export const toolbar = css`
//     position: absolute;
//     bottom: 10px;
//     right: 10px;
// `
