import { css } from '~/emotion'
import { MicroElement } from '~/micro-element'

export class Toolbar extends MicroElement {
    private isActive = false

    mounted() {
        const buttons = [
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

        this.el.classList.add(Toolbar.styles.container)

        buttons.forEach((row) => {
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

        ev.stopPropagation()

        switch (el.dataset.action) {
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
}

export namespace Toolbar {
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
    }
}
