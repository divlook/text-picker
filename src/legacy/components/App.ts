import clipboardy from 'clipboardy'
import Tesseract from 'tesseract.js'
import { css } from '~/libs/emotion'
import { Coordinate } from '~/interfaces'
// import { BlockParser } from '~/libs/block-parser'
import { MicroElement } from '~/libs/micro-element'
import { GuideBox } from '~/legacy/components/GuideBox'
import { Backdrop } from '~/legacy/components/Backdrop'
import { getZIndex, throttle } from '~/libs/utils'
import { CHROME_ACTION_NAME } from '~/chrome/constants'
import { makeChromeMessage } from '~/chrome/events'

export class App extends MicroElement {
    backdrop = new Backdrop()
    guideBox = new GuideBox()

    isActive = false

    coordinates: Coordinate[] = []

    // XXX: 삭제
    // blocks?: BlockParser

    mounted() {
        this.el.appendChild(this.backdrop.el)
        this.el.appendChild(this.guideBox.el)

        window.addEventListener('click', this.onClick, true)
        window.addEventListener('resize', this.onResize)

        this.guideBox.on('move', () => {
            // TODO: 움직일 때마다 파싱되게 해야될 듯, 디바운싱으로 구현
            // this.blocks?.select(this.guideBox.outline)
        })

        this.guideBox.on('copy', async () => {
            const dataUri = await this.capture()

            if (dataUri) {
                const { data } = await Tesseract.recognize(dataUri)
                console.log(data.text)
                console.log(data.words)

                try {
                    await clipboardy.write(data.text)
                    this.guideBox.toolbar.setActionState('copy', true)
                    return
                } catch {
                    //
                }

                // window.open()?.document.write(`
                //     <img src="${dataUri}" />
                // `)
            }

            this.guideBox.toolbar.setActionState('copy', false)
        })

        this.guideBox.on('translate', async () => {
            const dataUri = await this.capture()

            if (dataUri) {
                const { data } = await Tesseract.recognize(dataUri)
                console.log(data.text)
                console.log(data.words)

                const encodedText = encodeURIComponent(data.text)
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
            const pointPosition = this.guideBox.getPointPosition(x, y)

            switch (pointPosition) {
                case 'outside':
                case 'none': {
                    this.clear()
                    break
                }

                case 'border': {
                    ev.preventDefault()
                    ev.stopPropagation()
                    break
                }
            }
            return
        }

        if (this.isActive) {
            this.setPoint(x, y)
        }
    }

    private onResize = throttle(1000, () => {
        // TODO: 창 리사이즈될 때도 계산할지 고민 중
        // this.blocks?.reparseOffsetAllBlock()
    })

    start() {
        const zIndex = getZIndex(document.body)

        this.backdrop.setZIndex(zIndex)
        this.guideBox.setZIndex(zIndex)

        // XXX: 삭제
        // this.blocks?.claer()
        // this.blocks = new BlockParser(document.body, {
        //     ignoreElements: [this.el],
        // })

        this.enableBodyScrollbar(true)

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

        // XXX: 삭제
        // this.blocks?.claer()
        this.render()

        this.enableBodyScrollbar(false)
    }

    capture() {
        return new Promise<Blob | string | void>((resolve) => {
            this.guideBox.toolbar.setActive(false)

            chrome.runtime.sendMessage(
                makeChromeMessage(CHROME_ACTION_NAME.CAPTURE)(),
            )

            this.on('capture', (dataUri?: string) => {
                this.guideBox.toolbar.setActive(true)
                this.off('capture')

                if (!dataUri) {
                    resolve()
                    return
                }

                const img = new Image()
                img.src = dataUri
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const { outline } = this.guideBox
                    const ratio = window.devicePixelRatio

                    canvas.width = outline.width
                    canvas.height = outline.height

                    const ctx = canvas.getContext('2d')

                    if (ctx) {
                        const left = outline.x
                        const top = outline.y - window.scrollY

                        ctx.drawImage(
                            img,
                            left * ratio,
                            top * ratio,
                            outline.width * ratio,
                            outline.height * ratio,
                            0,
                            0,
                            outline.width,
                            outline.height,
                        )

                        resolve(canvas.toDataURL())
                    }
                }
            })
        })
    }

    enableBodyScrollbar(isEnabled: boolean) {
        document.body.classList.remove(App.styles.body.hiddenScrollbar)

        if (isEnabled) {
            document.body.classList.add(App.styles.body.hiddenScrollbar)
        }
    }
}

export namespace App {
    export const styles = {
        container: css``,
        crosshair: css`
            cursor: crosshair;
        `,
        body: {
            hiddenScrollbar: css`
                overflow: hidden !important;
            `,
        },
    }
}
