import { cx, css } from '~/emotion'
import { Coordinate } from '~/interfaces'
import { BlockParser } from '~/block-parser'
import GuideBox, { styles as guideBoxStyles } from '~/components/GuideBox'
import Backdrop from '~/components/Backdrop'

const styles = {
    container: css(),
    crosshair: css({
        cursor: 'crosshair',
    }),
}

export default class App {
    el
    backdrop = new Backdrop()
    guideBox = new GuideBox()

    #active = false

    #coordinates: Coordinate[] = []

    #blocks?: BlockParser

    constructor() {
        this.el = document.createElement('div')

        this.#render()

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

                if (this.#active) {
                    const x = ev.clientX + window.scrollX
                    const y = ev.clientY + window.scrollY

                    this.setPoint(x, y)
                }
            },
            true
        )

        this.guideBox.onMove(() => {
            this.#blocks?.select(this.guideBox.outline)
        })
    }

    #render() {
        this.el.className = [styles.container, cx()].join(' ')
    }

    start() {
        this.#blocks?.claer()
        this.#blocks = new BlockParser(document.body)

        window.requestAnimationFrame(() => {
            this.#active = true
            this.#coordinates = []

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

        this.#coordinates.push([x, y])

        this.guideBox.setPoint(x, y)

        if (this.#coordinates.length === 2) {
            this.#active = false
            document.body.classList.remove(styles.crosshair)
        }
    }

    clear() {
        this.guideBox.clear()
        this.#coordinates = []
        this.#blocks?.claer()
        this.#render()
    }
}
