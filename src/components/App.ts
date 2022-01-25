import clipboardy from 'clipboardy'
import { css } from '~/emotion'
import { Coordinate } from '~/interfaces'
import { BlockParser } from '~/block-parser'
import { MicroElement } from '~/micro-element'
import { GuideBox } from '~/components/GuideBox'
import { Backdrop } from '~/components/Backdrop'
import { throttle } from '~/utils'

export class App extends MicroElement {
    backdrop = new Backdrop()
    guideBox = new GuideBox()

    isActive = false

    coordinates: Coordinate[] = []

    blocks?: BlockParser

    mounted() {
        this.el.appendChild(this.backdrop.el)
        this.el.appendChild(this.guideBox.el)

        window.addEventListener('click', this.onClick, true)
        window.addEventListener('resize', this.onResize)

        this.guideBox.on('move', () => {
            this.blocks?.select(this.guideBox.outline)
        })

        this.guideBox.on('copy', async () => {
            const text = this.blocks?.toString()

            if (text) {
                try {
                    await clipboardy.write(text)
                    this.guideBox.toolbar.setActionState('copy', true)
                    return
                } catch {
                    //
                }
            }

            this.guideBox.toolbar.setActionState('copy', false)
        })

        this.guideBox.on('translate', () => {
            const text = this.blocks?.toString()

            if (text) {
                const encodedText = encodeURIComponent(text)
                const url = `https://translate.google.com/?sl=auto&text=${encodedText}`

                this.guideBox.toolbar.setActionState('translate', true)

                window.open(url)
                return
            }

            this.guideBox.toolbar.setActionState('translate', false)
        })

        this.guideBox.on('close', () => {
            this.clear()
        })
    }

    render() {
        this.el.className = MicroElement.classes(App.styles.container)
    }

    beforeDestroy() {
        window.removeEventListener('click', this.onClick, true)
        this.guideBox.off()
    }

    private onClick = (ev: MouseEvent) => {
        const x = ev.clientX + window.scrollX
        const y = ev.clientY + window.scrollY

        if (this.guideBox.isDone) {
            if (this.guideBox.isAcceptablePoint(x, y)) {
                ev.preventDefault()
                ev.stopPropagation()
                return
            }

            this.clear()

            return
        }

        if (this.isActive) {
            this.setPoint(x, y)
        }
    }

    private onResize = throttle(1000, () => {
        this.blocks?.reparseOffsetAllBlock()
    })

    start() {
        const zIndex = BlockParser.getZIndex(document.body)

        this.backdrop.setZIndex(zIndex)
        this.guideBox.setZIndex(zIndex)

        this.blocks?.claer()
        this.blocks = new BlockParser(document.body)

        MicroElement.nextTick(() => {
            this.isActive = true
            this.coordinates = []

            if (document.body.classList.contains(App.styles.crosshair)) {
                document.body.classList.remove(App.styles.crosshair)
            }

            document.body.classList.add(App.styles.crosshair)

            this.backdrop.setActive(true)
        })
    }

    /**
     * 가이드상자의 시작점과 끝점을 찍는 함수
     */
    setPoint(x: number, y: number) {
        this.backdrop.setActive(false)

        this.coordinates.push([x, y])

        this.guideBox.setPoint(x, y)

        if (this.coordinates.length === 2) {
            this.isActive = false
            document.body.classList.remove(App.styles.crosshair)
        }
    }

    clear() {
        this.guideBox.clear()
        this.coordinates = []
        this.blocks?.claer()
        this.render()
    }
}

export namespace App {
    export const styles = {
        container: css``,
        crosshair: css`
            cursor: crosshair;
        `,
    }
}
