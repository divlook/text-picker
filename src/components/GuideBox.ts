import { cx, css } from '../emotion'

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

    #active = false

    #coordinates: [number, number][] = []

    constructor() {
        this.el = document.createElement('div')

        styles.pointMap.forEach((point) => {
            const div = document.createElement('div')

            div.className = cx(styles.point, point)

            this.el.appendChild(div)
        })

        this.#render()

        window.addEventListener('mousemove', (ev) => {
            if (this.#active) {
                console.log(ev)
            }
        }, true)
    }

    #render() {
        this.el.className = cx(styles.container)
    }

    setPoint(x: number, y: number) {
        const count = this.#coordinates.length

        if (count === 0 || count === 2) {
            this.#coordinates = []
            this.#active = true
        } else {
            this.#active = false
        }

        this.#coordinates.push([x, y])
    }
}
