import { css } from '~/emotion'
import { MicroElement } from '~/micro-element'

export class Toolbar extends MicroElement {
    private isActive = false

    private stateMap: Map<Toolbar.ActionKey, Toolbar.ActionState> = new Map()

    private buttons: Toolbar.Button[] = [
        {
            label: 'Copy',
            action: 'copy',
        },
        {
            label: 'Translate',
            action: 'translate',
        },
        {
            label: 'Close',
            action: 'close',
        },
    ]

    mounted() {
        this.el.classList.add(Toolbar.styles.container)

        this.buttons.forEach((row) => {
            const button = document.createElement('button')

            button.textContent = row.label
            button.className = MicroElement.classes(Toolbar.styles.button)
            button.dataset.action = row.action

            this.el.appendChild(button)
        })

        this.el.addEventListener('mousedown', this.onMouseDown)
        this.el.addEventListener('click', this.onClick)
    }

    render() {
        this.buttons.forEach(({ action }) => {
            const state = this.stateMap.get(action)

            const button = this.el.querySelector(`[data-action="${action}"]`)

            if (!button) return

            if (state) {
                if (button.classList.contains(Toolbar.styles.successButton)) {
                    if (!state.success) {
                        button.classList.remove(Toolbar.styles.successButton)
                    }
                } else {
                    if (state.success) {
                        button.classList.add(Toolbar.styles.successButton)
                    }
                }

                if (button.classList.contains(Toolbar.styles.failButton)) {
                    if (state.success) {
                        button.classList.remove(Toolbar.styles.failButton)
                    }
                } else {
                    if (!state.success) {
                        button.classList.add(Toolbar.styles.failButton)
                    }
                }

                return
            }

            button.classList.remove(Toolbar.styles.successButton)
            button.classList.remove(Toolbar.styles.failButton)
        })

        if (this.isActive) {
            this.showAnimation()
            return
        }

        this.hideAnimation()
    }

    beforeDestroy() {
        this.el.removeEventListener('mousedown', this.onMouseDown)
        this.el.removeEventListener('click', this.onClick)
    }

    private onMouseDown = (ev: MouseEvent) => {
        ev.stopPropagation()
    }

    private onClick = (ev: MouseEvent) => {
        const el = ev.target as HTMLElement
        const action = el.dataset.action as Toolbar.ActionKey | undefined

        ev.stopPropagation()

        switch (action) {
            case 'copy': {
                this.emit('copy')
                break
            }

            case 'translate': {
                this.emit('translate')
                break
            }

            case 'close': {
                this.emit('close')
                break
            }
        }
    }

    private showAnimation() {
        if (!this.el.classList.contains(Toolbar.styles.active)) {
            this.el.classList.add(Toolbar.styles.active)
        }
    }

    private hideAnimation() {
        if (this.el.classList.contains(Toolbar.styles.active)) {
            this.el.classList.remove(Toolbar.styles.active)
        }
    }

    setActive(active: boolean) {
        this.isActive = active
        this.render()
    }

    setActionState(key: Toolbar.ActionKey, success: boolean) {
        const actionState = this.stateMap.get(key)

        clearTimeout(actionState?.timeoutId)

        this.stateMap.set(key, {
            success,
            timeoutId: window.setTimeout(() => {
                this.stateMap.delete(key)
                this.render()
            }, 1000),
        })

        this.render()
    }
}

export namespace Toolbar {
    export type ActionKey = 'copy' | 'translate' | 'close'

    export interface Button {
        label: string
        action: ActionKey
    }

    export interface ActionState {
        success: boolean
        timeoutId: number
    }

    export namespace styles {
        export const container = css`
            padding: 4px 6px 0;
            border-radius: 6px;
            background: rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(2px);
            cursor: default;
            display: none;
        `

        export const active = css`
            display: block !important;
        `

        export const button = css`
            font-family: sans-serif;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.5);
            color: rgba(0, 0, 0, 0.5);
            border: 1px solid white;
            padding: 0.4em 0.8em;
            margin-right: 6px;
            margin-bottom: 4px;
            border-radius: 4px;
            cursor: pointer;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
            transition: background 0.3s;

            &:hover {
                background: dodgerblue;
                color: white;
            }

            &:active {
                transform: translateY(1px);
                box-shadow: none;
            }

            &:last-child {
                margin-right: 0;
            }
        `

        export const successButton = css`
            background: mediumseagreen !important;
        `

        export const failButton = css`
            background: tomato !important;
        `
    }
}
