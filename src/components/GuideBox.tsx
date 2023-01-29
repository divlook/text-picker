import { FC, useCallback, useEffect, useRef } from 'react'
import { useSimpleState } from '~/libs/hooks/simple-state'
import * as styles from '~/components/GuideBox.styles'
import { Mode, Props, State } from '~/components/GuideBox.types'
import { cx } from '~/libs/emotion'
import { Coordinate } from '~/libs/global/types'
import { useComposedRef } from '~/libs/hooks/composed-ref'
import Backdrop from '~/components/Backdrop'
import { throttle } from '~/libs/utils'

const GuideBox: FC<Props> = (props) => {
    const [state, setState] = useSimpleState<State>({
        coordinates: props.coordinates ?? [],
        dragTargetEl: null,
        outline: {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        },
        outlineAdjustPoint: [0, 0],
        mode: Mode.Default,
    })

    const scope = useComposedRef(() => {
        const zIndex = props.zIndex ?? 0
        const throttleTime = props.throttleTime ?? 300
        const onUpdateOutline = props.onUpdateOutline ?? (() => {})

        return {
            ...state,
            zIndex,
            throttleTime,
            onUpdateOutline,
            isActivated: state.coordinates.length > 0,
            isAutoDraw: state.coordinates.length === 1,
            isDone: state.coordinates.length === 2,
        }
    })

    const rootEl = useRef<HTMLDivElement>(null)

    const pointElMap = useRef(new Map<string, HTMLDivElement | null>())

    const pointStyles = useRef([
        styles.pointTop,
        styles.pointBottom,
        styles.pointLeft,
        styles.pointRight,
        styles.pointTopLeft,
        styles.pointTopRight,
        styles.pointBottomLeft,
        styles.pointBottomRight,
    ])

    const onUpdateOutline = useCallback(
        throttle(scope.current.throttleTime, scope.current.onUpdateOutline),
        [props.throttleTime, props.onUpdateOutline],
    )

    function calcOutline(nextCoordinates: Coordinate[]) {
        const coordinates = nextCoordinates.slice(0, 2)
        const xPoints: number[] = []
        const yPoints: number[] = []

        if (coordinates.length === 0) {
            return
        }

        if (coordinates.length === 1) {
            coordinates.push(coordinates[0])
        }

        for (const [x, y] of coordinates) {
            xPoints.push(x)
            yPoints.push(y)
        }

        coordinates.length = 0

        xPoints.sort((a, b) => a - b)
        yPoints.sort((a, b) => a - b)

        const [startX, endX] = xPoints
        const [startY, endY] = yPoints

        setState({
            outline: {
                x: startX,
                y: startY,
                width: endX - startX,
                height: endY - startY,
            },
        })
    }

    function onClick(ev: MouseEvent) {
        const x = ev.clientX + window.scrollX
        const y = ev.clientY + window.scrollY

        if (scope.current.isDone) {
            const pointPosition = getPointPosition(x, y)

            switch (pointPosition) {
                case 'outside':
                case 'none': {
                    clearState()
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

        const coordinates: Coordinate[] = []

        if (scope.current.coordinates.length === 1) {
            coordinates.push(scope.current.coordinates[0])
        }

        coordinates.push([x, y])

        setState({
            coordinates,
        })
    }

    function onMouseDown(ev: MouseEvent) {
        if (!rootEl.current) return

        let outlineAdjustPoint = scope.current.outlineAdjustPoint

        if (scope.current.isDone) {
            const target = ev.target as HTMLDivElement
            const dragTargetEl = target
            let isValidTarget = true

            switch (dragTargetEl) {
                case rootEl.current: {
                    const rect = rootEl.current.getBoundingClientRect()

                    outlineAdjustPoint = [
                        ev.clientX - rect.left,
                        ev.clientY - rect.top,
                    ]
                    break
                }

                case pointElMap.current.get(styles.pointTop):
                case pointElMap.current.get(styles.pointLeft):
                case pointElMap.current.get(styles.pointTopLeft): {
                    outlineAdjustPoint = [
                        scope.current.outline.x + scope.current.outline.width,
                        scope.current.outline.y + scope.current.outline.height,
                    ]
                    break
                }

                case pointElMap.current.get(styles.pointRight):
                case pointElMap.current.get(styles.pointTopRight): {
                    outlineAdjustPoint = [
                        scope.current.outline.x,
                        scope.current.outline.y + scope.current.outline.height,
                    ]
                    break
                }

                case pointElMap.current.get(styles.pointBottom):
                case pointElMap.current.get(styles.pointBottomLeft): {
                    outlineAdjustPoint = [
                        scope.current.outline.x + scope.current.outline.width,
                        scope.current.outline.y,
                    ]
                    break
                }

                case pointElMap.current.get(styles.pointBottomRight): {
                    outlineAdjustPoint = [
                        scope.current.outline.x,
                        scope.current.outline.y,
                    ]
                    break
                }

                default: {
                    isValidTarget = false
                    break
                }
            }

            if (isValidTarget) {
                setState({
                    mode: Mode.Dragging,
                    dragTargetEl,
                    outlineAdjustPoint,
                })
            }
        }
    }

    function onMouseMove(ev: MouseEvent) {
        if (scope.current.mode === Mode.Dragging) {
            // 드래그로 상자 움직일 때 텍스트 선택되는 현상 방지
            ev.preventDefault()
        }

        if (scope.current.isAutoDraw) {
            calcOutline([
                ...scope.current.coordinates,
                [ev.clientX + window.scrollX, ev.clientY + window.scrollY],
            ])
            return
        }

        if (scope.current.isDone) {
            if (scope.current.mode === Mode.Dragging) {
                switch (scope.current.dragTargetEl) {
                    case rootEl.current: {
                        setState({
                            outline: {
                                ...scope.current.outline,
                                x:
                                    ev.pageX -
                                    scope.current.outlineAdjustPoint[0],
                                y:
                                    ev.pageY -
                                    scope.current.outlineAdjustPoint[1],
                            },
                        })
                        break
                    }

                    case pointElMap.current.get(styles.pointTop):
                    case pointElMap.current.get(styles.pointBottom): {
                        calcOutline([
                            [
                                scope.current.outline.x,
                                scope.current.outlineAdjustPoint[1],
                            ],
                            [
                                scope.current.outline.x +
                                    scope.current.outline.width,
                                ev.pageY,
                            ],
                        ])
                        break
                    }

                    case pointElMap.current.get(styles.pointLeft):
                    case pointElMap.current.get(styles.pointRight): {
                        calcOutline([
                            [
                                scope.current.outlineAdjustPoint[0],
                                scope.current.outline.y,
                            ],
                            [
                                ev.pageX,
                                scope.current.outline.y +
                                    scope.current.outline.height,
                            ],
                        ])
                        break
                    }

                    default: {
                        calcOutline([
                            scope.current.outlineAdjustPoint,
                            [ev.pageX, ev.pageY],
                        ])
                        break
                    }
                }
            }
            return
        }
    }

    function onMouseUp() {
        setState({
            mode: Mode.Default,
        })
    }

    function getPointPosition(x: number, y: number) {
        if (!scope.current.isDone) {
            return 'none'
        }

        /**
         * 허용 범위(단위 px)
         */
        const allowableRange = 20

        let left = scope.current.outline.x
        let right = left + scope.current.outline.width
        let top = scope.current.outline.y
        let bottom = top + scope.current.outline.height

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

    function clearState() {
        setState({
            coordinates: [],
            dragTargetEl: null,
            outline: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },
            outlineAdjustPoint: [0, 0],
            mode: Mode.Default,
        })
    }

    function setBodyCrosshair(isEnabled: boolean) {
        if (isEnabled) {
            if (!document.body.classList.contains(styles.crosshair)) {
                document.body.classList.add(styles.crosshair)
            }
            return
        }

        if (document.body.classList.contains(styles.crosshair)) {
            document.body.classList.remove(styles.crosshair)
        }
    }

    useEffect(() => {
        window.addEventListener('click', onClick, true)
        window.addEventListener('mousedown', onMouseDown, true)
        window.addEventListener('mousemove', onMouseMove, true)
        window.addEventListener('mouseup', onMouseUp, true)

        setBodyCrosshair(scope.current.isActivated)

        return () => {
            window.removeEventListener('click', onClick, true)
            window.removeEventListener('mousedown', onMouseDown, true)
            window.removeEventListener('mousemove', onMouseMove, true)
            window.removeEventListener('mouseup', onMouseUp, true)

            setBodyCrosshair(false)
        }
    }, [])

    useEffect(() => {
        setState({
            coordinates: props.coordinates ?? [],
        })
    }, [props.coordinates])

    useEffect(() => {
        if (scope.current.isActivated) {
            calcOutline(scope.current.coordinates.slice(0, 2))
        }

        setBodyCrosshair(scope.current.isActivated)
    }, [scope.current.coordinates])

    useEffect(() => {
        onUpdateOutline(state.outline)
    }, [state.outline])

    return (
        <>
            <div
                ref={rootEl}
                className={cx(styles.container, {
                    [styles.activated]: scope.current.isActivated,
                })}
                style={{
                    zIndex: scope.current.zIndex,
                    width: `${state.outline.width}px`,
                    height: `${state.outline.height}px`,
                    transform: `translate(${state.outline.x}px, ${state.outline.y}px)`,
                }}
            >
                {pointStyles.current.map((styleName, key) => (
                    <div
                        ref={(el) => pointElMap.current.set(styleName, el)}
                        className={cx(styles.point, styleName)}
                        key={key}
                    />
                ))}
            </div>

            <Backdrop
                zIndex={scope.current.zIndex}
                activated={!scope.current.isActivated}
            />
        </>
    )
}

export default GuideBox
