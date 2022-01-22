import { css } from '~/emotion'
import { Coordinate } from '~/interfaces'
import { BlockParser } from '~/block-parser'
import { MicroElement } from '~/micro-element'
import GuideBox, { styles as guideBoxStyles } from '~/components/GuideBox'
import Backdrop from '~/components/Backdrop'

const styles = {
    container: css(),
    crosshair: css({
        cursor: 'crosshair',
    }),
}

export default class App extends MicroElement {
    backdrop = new Backdrop()
    guideBox = new GuideBox()

    private isActive = false

    coordinates: Coordinate[] = []

    blocks?: BlockParser

    mounted() {
        this.el.appendChild(this.backdrop.el)
        this.el.appendChild(this.guideBox.el)

        window.addEventListener(
            'click',
            (ev) => {
                if (this.guideBox.isDone) {
                    const target = ev.target as HTMLElement

                    const isActive = [
                        target.classList.contains(guideBoxStyles.container),
                        !!target.closest(`.${guideBoxStyles.container}`),
                    ].some((value) => value)

                    if (isActive) {
                        return
                    }

                    this.clear()

                    return
                }

                if (this.isActive) {
                    const x = ev.clientX + window.scrollX
                    const y = ev.clientY + window.scrollY

                    this.setPoint(x, y)
                }
            },
            true
        )

        this.guideBox.on('move', () => {
            this.blocks?.select(this.guideBox.outline)
        })
    }

    render() {
        this.el.className = MicroElement.classes(styles.container)
    }

    start() {
        this.blocks?.claer()
        this.blocks = new BlockParser(document.body)

        MicroElement.nextTick(() => {
            this.isActive = true
            this.coordinates = []

            if (document.body.classList.contains(styles.crosshair)) {
                document.body.classList.remove(styles.crosshair)
            }

            document.body.classList.add(styles.crosshair)

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
            document.body.classList.remove(styles.crosshair)
        }
    }

    clear() {
        this.guideBox.clear()
        this.coordinates = []
        this.blocks?.claer()
        this.render()
    }
}
