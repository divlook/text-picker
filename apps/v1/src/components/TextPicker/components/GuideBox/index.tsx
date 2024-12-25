import { GuideBoxFns } from '@/components/TextPicker/components/GuideBox/fns'
import { GuideBoxSchema } from '@/components/TextPicker/components/GuideBox/schema'
import PointHandler from '@/components/TextPicker/components/PointHandler'
import { useMoveableHandler } from '@/hooks/useMoveableHandler'
import { useWatchState } from '@/hooks/useWatchState'
import {
  type BoundaryWithOffsetSchema,
  type BoundingBoxSchema,
  pixel,
} from '@text-picker/core'
import classNames from 'classnames'
import {
  type CSSProperties,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

function GuideBox(_props: GuideBoxSchema.PropsInput) {
  const props = GuideBoxSchema.Props.parse(_props)

  const rootEl = useRef<HTMLDivElement>(null)

  const moveableHandler = useMoveableHandler({
    direction: 'all',
    onMove({ x, y }) {
      updateMovedBoxState({
        x,
        y,
      })
    },
    onMoveEnd() {
      commitMovedBoxState()
    },
  })

  const points = GuideBoxFns.createPointHandlers({
    updateMovedBoxState,
  })

  const [boxState, setBoxState] = useState(GuideBoxFns.getInitialBoxState())

  const [movedBoxState, setMovedBoxState] = useState(
    GuideBoxFns.getInitialMovedBoxState(),
  )

  const boxLayout = useMemo<BoundingBoxSchema>(() => {
    return GuideBoxFns.getBoxLayoutWithMinimums({
      boxState,
      movedBoxState,
    })
  }, [boxState, movedBoxState])

  const boxStyle = useMemo(() => {
    const x = boxLayout.x
    const y = boxLayout.y

    const style: CSSProperties = {
      width: pixel(boxLayout.width),
      height: pixel(boxLayout.height),
    }

    style.translate = `${pixel(x)} ${pixel(y)}`

    return style
  }, [boxLayout.x, boxLayout.y, boxLayout.width, boxLayout.height])

  useWatchState(boxLayout, emitLayout)

  useEffect(() => {
    const resizeListener = () => {
      emitLayout()
    }

    emitLayout()

    window.addEventListener('resize', resizeListener)

    return () => {
      window.removeEventListener('resize', resizeListener)
    }
  }, [])

  useImperativeHandle(props.controllerRef, () => {
    return {
      resetState,
    }
  })

  function updateMovedBoxState(next: Partial<BoundaryWithOffsetSchema>) {
    setMovedBoxState((current) => ({
      ...current,
      ...next,
    }))
  }

  function emitLayout() {
    const rect = rootEl.current?.getBoundingClientRect()

    if (!rect) {
      return
    }

    props.onLayout?.({
      relative: boxLayout,
      absolute: rect,
    })
  }

  function commitMovedBoxState() {
    setBoxState(
      GuideBoxFns.getBoxLayoutWithMinimums({
        boxState,
        movedBoxState,
      }),
    )
    setMovedBoxState(GuideBoxFns.getInitialMovedBoxState())
  }

  function resetState() {
    setBoxState(GuideBoxFns.getInitialBoxState())
    setMovedBoxState(GuideBoxFns.getInitialMovedBoxState())
  }

  return (
    <div
      ref={rootEl}
      className={classNames(
        props.className,
        'relative border-2 border-dodger_blue border-dashed shadow-lg',
        props.inactive && 'pointer-events-none',
      )}
      style={{
        ...props.style,
        ...boxStyle,
      }}
    >
      {!props.inactive &&
        moveableHandler.slots.handler({
          className: classNames(
            'relative cursor-move',
            props.devMode && 'bg-red-500/50',
          ),
          style: (() => {
            const ratio = 5
            const size = 100 * ratio
            const moved = -50 + 50 / ratio

            if (!moveableHandler.isDragging) {
              return {
                width: '100%',
                height: '100%',
              }
            }

            return {
              width: `${size}%`,
              height: `${size}%`,
              translate: `${moved}% ${moved}%`,
              zIndex: 1,
            }
          })(),
        })}

      {points.map((opt, index) => {
        const pointProps = opt.props()

        return (
          <PointHandler
            key={index}
            {...pointProps}
            className={classNames(pointProps.className, 'absolute')}
            inactive={props.inactive}
            devMode={props.devMode}
            onMoveEnd={commitMovedBoxState}
          />
        )
      })}
    </div>
  )
}

export default GuideBox
