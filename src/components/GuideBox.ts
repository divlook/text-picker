import { cx, css } from '~/emotion'
import { Coordinate } from '~/interfaces'

const styles = {
    container: css({
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10000, // TODO:
        borderWidth: 2,
        borderColor: 'dodgerblue',
        borderStyle: 'dashed',
        width: 100,
        height: 100,
        transform: `translate(0, 10px)`,
        boxSizing: 'border-box',
        cursor: 'move',
        display: 'none',
    }),
    active: css({
        display: 'block',
    }),
    point: css({
        position: 'absolute',
        cursor: 'grab',
        width: 10,
        height: 10,
        backgroundColor: 'dodgerblue',
    }),
    pointMap: [
        css({
            top: -6,
            left: -6,
            cursor: 'nwse-resize',
        }),
        css({
            top: -6,
            right: -6,
            cursor: 'nesw-resize',
        }),
        css({
            bottom: -6,
            right: -6,
            cursor: 'nwse-resize',
        }),
        css({
            bottom: -6,
            left: -6,
            cursor: 'nesw-resize',
        }),
    ],
}

export default class GuideBox {
    el

    #coordinates: Coordinate[] = []

    /**
     * TODO: setPoint가 실행될 때 #coordinates 기준으로 outline 계산 필요
     */
    #outline = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    }

    get #active() {
        return this.#coordinates.length > 0
    }

    constructor() {
        this.el = document.createElement('div')

        styles.pointMap.forEach((point) => {
            const div = document.createElement('div')

            div.className = cx(styles.point, point)

            this.el.appendChild(div)
        })

        this.#render()

        window.addEventListener(
            'mousemove',
            (ev) => {
                if (this.#active) {
                    console.log(ev)
                }
            },
            true
        )
    }

    #render() {
        this.el.className = cx(styles.container, {
            [styles.active]: this.#active,
        })
    }

    setPoint(x: number, y: number) {
        if (this.#coordinates.length === 2) {
            this.#coordinates = []
        }

        this.#coordinates.push([x, y])

        this.#render()
    }
}
