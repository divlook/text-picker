import { css, cx } from '~/emotion'
import { Coordinate, Outline } from '~/interfaces'
import { MicroElement } from '~/micro-element'
import { Toolbar } from '~/components/Toolbar'
import { rgb } from '~/utils'
import { dodger_blue } from '~/palette'

export class GuideBox extends MicroElement {
    toolbar = new Toolbar()

    coordinates: Coordinate[] = []

    mode = GuideBox.mode.Default

    outline: Outline = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    }

    private zIndex = 0

    private outlineAdjustPoint: Coordinate = [0, 0]

    private dragTargetClassName = ''

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
        const pointClassNames = [
            GuideBox.styles.pointTop,
            GuideBox.styles.pointBottom,
            GuideBox.styles.pointLeft,
            GuideBox.styles.pointRight,
            GuideBox.styles.pointTopLeft,
            GuideBox.styles.pointTopRight,
            GuideBox.styles.pointBottomLeft,
            GuideBox.styles.pointBottomRight,
        ]

        pointClassNames.forEach((className) => {
            const div = document.createElement('div')

            div.className = MicroElement.classes(
                GuideBox.styles.point,
                className
            )

            this.el.appendChild(div)
        })

        this.el.appendChild(this.toolbar.el)

        this.toolbar.el.classList.add(GuideBox.styles.toolbar)

        window.addEventListener('mousedown', this.onMouseDown)
        window.addEventListener('mousemove', this.onMouseMove)
        window.addEventListener('mouseup', this.onMouseUp)

        this.toolbar.on('copy', () => {
            this.emit('copy')
        })

        this.toolbar.on('translate', () => {
            this.emit('translate')
        })

        this.toolbar.on('close', () => {
            this.emit('close')
        })
    }

    render() {
        const { x, y, width, height } = this.outline

        this.el.style.zIndex = String(this.zIndex)

        MicroElement.nextTick(() => {
            this.el.className = MicroElement.classes(
                GuideBox.styles.container,
                cx({
                    [GuideBox.styles.active]: this.isActive,
                })
            )

            this.el.style.width = `${width}px`
            this.el.style.height = `${height}px`
            this.el.style.transform = `translate(${x}px, ${y}px)`

            this.toolbar.setActive(this.isDone)
        })
    }

    beforeDestroy() {
        window.removeEventListener('mousedown', this.onMouseDown)
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('mouseup', this.onMouseUp)

        this.toolbar.off()
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

    private onMouseDown = (ev: MouseEvent) => {
        if (this.isDone) {
            const target = ev.target as HTMLElement
            const targetClassNames = [
                GuideBox.styles.container,
                GuideBox.styles.pointTop,
                GuideBox.styles.pointBottom,
                GuideBox.styles.pointLeft,
                GuideBox.styles.pointRight,
                GuideBox.styles.pointTopLeft,
                GuideBox.styles.pointTopRight,
                GuideBox.styles.pointBottomLeft,
                GuideBox.styles.pointBottomRight,
            ]

            targetClassNames.some((className) => {
                if (target.classList.contains(className)) {
                    this.dragTargetClassName = className
                    return true
                }

                return false
            })

            switch (this.dragTargetClassName) {
                case GuideBox.styles.container: {
                    const rect = this.el.getBoundingClientRect()

                    this.outlineAdjustPoint = [
                        ev.clientX - rect.left,
                        ev.clientY - rect.top,
                    ]
                    break
                }

                case GuideBox.styles.pointTop:
                case GuideBox.styles.pointLeft:
                case GuideBox.styles.pointTopLeft: {
                    this.outlineAdjustPoint = [
                        this.outline.x + this.outline.width,
                        this.outline.y + this.outline.height,
                    ]
                    break
                }

                case GuideBox.styles.pointRight:
                case GuideBox.styles.pointTopRight: {
                    this.outlineAdjustPoint = [
                        this.outline.x,
                        this.outline.y + this.outline.height,
                    ]
                    break
                }

                case GuideBox.styles.pointBottom:
                case GuideBox.styles.pointBottomLeft: {
                    this.outlineAdjustPoint = [
                        this.outline.x + this.outline.width,
                        this.outline.y,
                    ]
                    break
                }

                case GuideBox.styles.pointBottomRight: {
                    this.outlineAdjustPoint = [this.outline.x, this.outline.y]
                    break
                }
            }

            this.mode = GuideBox.mode.Dragging
        }
    }

    private onMouseMove = (ev: MouseEvent) => {
        if (this.mode === GuideBox.mode.Dragging) {
            // 드래그로 상자 움직일 때 텍스트 선택되는 현상 방지
            ev.preventDefault()
        }

        if (this.isAutoDraw) {
            this.calcOutline([
                ...this.coordinates,
                [ev.clientX + window.scrollX, ev.clientY + window.scrollY],
            ])

            this.render()

            this.emit('move')
            return
        }

        if (this.isDone) {
            if (this.mode === GuideBox.mode.Dragging) {
                switch (this.dragTargetClassName) {
                    case GuideBox.styles.container: {
                        this.outline.x = ev.pageX - this.outlineAdjustPoint[0]
                        this.outline.y = ev.pageY - this.outlineAdjustPoint[1]
                        break
                    }

                    case GuideBox.styles.pointTop:
                    case GuideBox.styles.pointBottom: {
                        this.calcOutline([
                            [this.outline.x, this.outlineAdjustPoint[1]],
                            [this.outline.x + this.outline.width, ev.pageY],
                        ])
                        break
                    }

                    case GuideBox.styles.pointLeft:
                    case GuideBox.styles.pointRight: {
                        this.calcOutline([
                            [this.outlineAdjustPoint[0], this.outline.y],
                            [ev.pageX, this.outline.y + this.outline.height],
                        ])
                        break
                    }

                    default: {
                        this.calcOutline([
                            this.outlineAdjustPoint,
                            [ev.pageX, ev.pageY],
                        ])
                        break
                    }
                }

                this.render()

                this.emit('move')
            }
            return
        }
    }

    private onMouseUp = () => {
        this.mode = GuideBox.mode.Default
    }

    setPoint(x: number, y: number) {
        if (this.coordinates.length === 2) {
            this.coordinates = []
        }

        this.coordinates.push([x, y])

        this.calcOutline(this.coordinates)

        this.render()
    }

    setZIndex(zIndex: number) {
        this.zIndex = zIndex
        this.render()
    }

    getPointPosition(x: number, y: number) {
        if (!this.isDone) {
            return 'none'
        }

        /**
         * 허용 범위(단위 px)
         */
        const allowableRange = 20

        let left = this.outline.x
        let right = left + this.outline.width
        let top = this.outline.y
        let bottom = top + this.outline.height

        const isInside = () => left < x && top < y && right > x && bottom > y

        if (isInside()) {
            return 'inside'
        }

        left -= allowableRange
        right += allowableRange
        top -= allowableRange
        bottom += allowableRange

        if (isInside()) {
            return 'border'
        }

        return 'outside'
    }

    clear() {
        this.coordinates = []

        this.render()
    }
}

export namespace GuideBox {
    export enum mode {
        Default,
        Dragging,
    }

    export namespace styles {
        export const container = css`
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10000;
            border-width: 2px;
            border-color: ${rgb(dodger_blue)};
            border-style: dashed;
            width: 0;
            height: 0;
            transform: translate(0, 10px);
            box-sizing: border-box;
            cursor: move;
            display: none;
        `

        export const active = css`
            display: block !important;
        `

        export const point = css`
            position: absolute;
            cursor: grab;
            width: 10px;
            height: 10px;
            background-color: ${rgb(dodger_blue)};
        `

        export const pointTop = css`
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            cursor: ns-resize;
        `

        export const pointBottom = css`
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            cursor: ns-resize;
        `

        export const pointLeft = css`
            top: 50%;
            left: -6px;
            transform: translateY(-50%);
            cursor: ew-resize;
        `

        export const pointRight = css`
            top: 50%;
            right: -6px;
            transform: translateY(-50%);
            cursor: ew-resize;
        `

        export const pointTopLeft = css`
            top: -6px;
            left: -6px;
            cursor: nwse-resize;
        `

        export const pointTopRight = css`
            top: -6px;
            right: -6px;
            cursor: nesw-resize;
        `

        export const pointBottomLeft = css`
            bottom: -6px;
            left: -6px;
            cursor: nesw-resize;
        `

        export const pointBottomRight = css`
            bottom: -6px;
            right: -6px;
            cursor: nwse-resize;
        `

        export const toolbar = css`
            position: absolute;
            bottom: 10px;
            right: 10px;
        `
    }
}
