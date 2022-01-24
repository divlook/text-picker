import { css, cx } from '~/emotion'
import { MicroElement } from '~/micro-element'

export class Backdrop extends MicroElement {
    el = document.createElement('div')

    private isActive = false

    private zIndex = 0

    render() {
        this.el.style.zIndex = String(this.zIndex)

        if (this.isActive) {
            this.showAnimation()
            return
        }

        this.hideAnimation()
    }

    private showAnimation() {
        this.el.className = MicroElement.classes(
            Backdrop.styles.container,
            cx({
                [Backdrop.styles.display]: true,
            })
        )

        MicroElement.nextTick(() => {
            this.el.className = MicroElement.classes(
                Backdrop.styles.container,
                cx({
                    [Backdrop.styles.display]: true,
                    [Backdrop.styles.active]: true,
                })
            )
        })
    }

    private hideAnimation() {
        this.el.className = MicroElement.classes(
            Backdrop.styles.container,
            cx({
                [Backdrop.styles.display]: true,
                [Backdrop.styles.active]: false,
            })
        )

        MicroElement.nextTick(() => {
            this.el.className = MicroElement.classes(Backdrop.styles.container)
        })
    }

    setActive(active: boolean) {
        this.isActive = active
        this.render()
    }

    setZIndex(zIndex: number) {
        this.zIndex = zIndex
        this.render()
    }
}

export namespace Backdrop {
    export namespace styles {
        export const container = css`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            opacity: 0;
            transition: opacity 0.5s;
            display: none;
        `

        export const active = css`
            opacity: 1 !important;
        `

        export const display = css`
            display: block !important;
        `
    }
}
