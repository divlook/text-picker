import { cx, css } from '~/emotion'
import { Coordinate, Outline } from '~/interfaces'
import { MicroElement } from '~/micro-element'

export enum GuideBoxMode {
    Default,
    Dragging,
}

export const styles = {
    container: css({
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10000, // TODO:
        borderWidth: 2,
        borderColor: 'dodgerblue',
        borderStyle: 'dashed',
        width: 0,
        height: 0,
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

export default class GuideBox extends MicroElement {
    coordinates: Coordinate[] = []

    mode = GuideBoxMode.Default

    outline: Outline = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    }

    private outlineAdjustValue: Outline = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    }

    get isActive() {
        return this.coordinates.length > 0
    }

    get isAutoDraw() {
        return this.coordinates.length === 1
    }

    get isDone() {
        return this.coordinates.length === 2
    }

    mounted() {
        styles.pointMap.forEach((point) => {
            const div = document.createElement('div')

            div.className = cx(styles.point, point)

            this.el.appendChild(div)
        })

        // TODO: 크기 변형할 수 있게 해야됨

        window.addEventListener(
            'mousemove',
            (ev) => {
                if (this.isAutoDraw) {
                    this.calcOutline([
                        ...this.coordinates,
                        [
                            ev.clientX + window.scrollX,
                            ev.clientY + window.scrollY,
                        ],
                    ])

                    this.render()

                    this.emit('move')
                }

                if (this.mode === GuideBoxMode.Dragging) {
                    // 드래그로 상자 움직일 때 텍스트 선택되는 현상 방지
                    ev.preventDefault()
                }
            },
            true
        )

        this.el.addEventListener('mousedown', (ev) => {
            if (this.isDone) {
                const rect = this.el.getBoundingClientRect()

                this.outlineAdjustValue.x = ev.clientX - rect.left
                this.outlineAdjustValue.y = ev.clientY - rect.top

                this.mode = GuideBoxMode.Dragging
            }
        })

        this.el.addEventListener('mousemove', (ev) => {
            if (!this.isDone) {
                return
            }

            if (this.mode === GuideBoxMode.Dragging) {
                this.outline.x = ev.pageX - this.outlineAdjustValue.x
                this.outline.y = ev.pageY - this.outlineAdjustValue.y

                this.render()

                this.emit('move')
            }
        })

        this.el.addEventListener('mouseup', () => {
            this.mode = GuideBoxMode.Default
        })
    }

    render() {
        const { x, y, width, height } = this.outline

        this.nextTick(() => {
            this.el.className = [
                styles.container,
                cx(
                    {
                        [styles.active]: this.isActive,
                    },
                    css({
                        width,
                        height,
                        transform: `translate(${x}px, ${y}px)`,
                    })
                ),
            ].join(' ')
        })
    }

    private calcOutline(nextCoordinates: Coordinate[]) {
        const coordinates: Coordinate[] = []
        const xPoints: number[] = []
        const yPoints: number[] = []

        if (nextCoordinates.length === 0) {
            return
        }

        coordinates.push(...nextCoordinates)

        if (nextCoordinates.length === 1) {
            coordinates.push(nextCoordinates[0])
        }

        for (const [x, y] of coordinates) {
            xPoints.push(x)
            yPoints.push(y)
        }

        xPoints.sort((a, b) => a - b)
        yPoints.sort((a, b) => a - b)

        const [startX, endX] = xPoints
        const [startY, endY] = yPoints

        this.outline.x = startX
        this.outline.y = startY
        this.outline.width = endX - startX
        this.outline.height = endY - startY
    }

    setPoint(x: number, y: number) {
        if (this.coordinates.length === 2) {
            this.coordinates = []
        }

        this.coordinates.push([x, y])

        this.calcOutline(this.coordinates)

        this.render()
    }

    clear() {
        this.coordinates = []

        this.render()
    }
}
