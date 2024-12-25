import { PointHandlerSchema } from '@/components/TextPicker/components/PointHandler/schema'
import { useMoveableHandler } from '@/hooks/useMoveableHandler'
import { pixel } from '@text-picker/core'
import classNames from 'classnames'
import { type FC, useMemo } from 'react'

const PointHandler: FC<PointHandlerSchema.Props.Input> = (_props) => {
  const props = PointHandlerSchema.Props.parse(_props)

  const moveableHandler = useMoveableHandler({
    direction: props.direction,
    moveable: props.moveable,
    onMoveStart: props.onMoveStart,
    onMove: props.onMove,
    onMoveEnd: props.onMoveEnd,
  })

  const cursorClassName = useMemo(() => {
    switch (props.cursor) {
      case 'ns-resize':
        return 'cursor-ns-resize'
      case 'ew-resize':
        return 'cursor-ew-resize'
      case 'nesw-resize':
        return 'cursor-nesw-resize'
      case 'nwse-resize':
        return 'cursor-nwse-resize'
      default:
        return 'cursor-move'
    }
  }, [props.cursor])

  const pointTranslate = useMemo(() => {
    let x = props.x
    let y = props.y

    if (props.moveable) {
      x += moveableHandler.coordinate.x
      y += moveableHandler.coordinate.y
    }

    return `${pixel(x)} ${pixel(y)}`
  }, [props.moveable, props.x, props.y, moveableHandler.coordinate])

  return (
    <div
      className={classNames(
        props.className,
        'h-[10px] w-[10px] bg-dodger_blue shadow',
      )}
      style={{
        translate: pointTranslate,
        ...props.style,
      }}
    >
      {!props.inactive &&
        moveableHandler.slots.handler({
          className: classNames(
            props.devMode && 'bg-red-500/50',
            cursorClassName,
            moveableHandler.isDragging
              ? 'h-[410px] w-[410px] translate-x-[-200px] translate-y-[-200px]'
              : 'h-[20px] w-[20px] translate-x-[-5px] translate-y-[-5px]',
          ),
        })}
    </div>
  )
}

export default PointHandler
