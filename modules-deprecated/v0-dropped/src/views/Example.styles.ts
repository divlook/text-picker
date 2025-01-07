import { css } from '~/libs/emotion'
import { dodger_blue, white } from '~/libs/palette'
import { rgb } from '~/libs/utils'

export const container = css`
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 80%;
    margin: 10% auto;
`

export const button = css`
    position: fixed;
    right: 36px;
    bottom: 36px;
    width: 64px;
    height: 64px;
    background: ${rgb(dodger_blue)};
    color: ${rgb(white)};
    border-radius: 50%;
    border: 0;
    cursor: pointer;
    padding: 0;
    font-size: 20px;
    box-shadow: 0 2px 6px 0 rgba(0 0 0 / 40%);
    transition: box-shadow 0.1s, bottom 0.1s;

    &:active {
        bottom: 34px;
        box-shadow: none;
    }
`
