import { MoveableHandlerSchema } from '@/hooks/useMoveableHandler/schema'
import { useEffect, useMemo, useRef, useState } from 'react'

export function useMoveableHandler(_opt?: MoveableHandlerSchema.Options.Input) {
  const opt = MoveableHandlerSchema.Options.parse(_opt)

  const slots = {
    handler: (props?: { className?: string; style?: React.CSSProperties }) => (
      <div
        {...props}
        draggable
        onDragStart={onDragStart}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      />
    ),
  }

  const lastCoordinate = useRef({
    x: 0,
    y: 0,
  })

  const [isDragging, setDragging] = useState(false)

  const [cursorStartCoordinate, setCursorStartCoordinate] = useState({
    x: 0,
    y: 0,
  })

  const [movement, setMovement] = useState({
    x: 0,
    y: 0,
  })

  const coordinate = useMemo(() => {
    const last = lastCoordinate.current
    const x = last.x + movement.x
    const y = last.y + movement.y

    return { x, y }
  }, [
    movement.x,
    movement.y,
    lastCoordinate.current.x,
    lastCoordinate.current.y,
  ])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isDragging) {
      opt.onMoveStart?.()
    } else {
      opt.onMoveEnd?.()
    }
  }, [isDragging])

  const onDragStart = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
  }

  const onMouseDown = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setDragging(true)

    if (opt.moveable) {
      lastCoordinate.current.x += movement.x
      lastCoordinate.current.y += movement.y

      setMovement({
        x: 0,
        y: 0,
      })
    }

    setCursorStartCoordinate({
      x: ev.pageX,
      y: ev.pageY,
    })
  }

  const onMouseUp = () => {
    setDragging(false)
  }

  const onMouseLeave = () => {
    setDragging(false)
  }

  const onMouseMove = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging) {
      return
    }

    ev.preventDefault()

    const next = {
      x: ev.pageX - cursorStartCoordinate.x,
      y: ev.pageY - cursorStartCoordinate.y,
    }

    switch (opt.direction) {
      case 'horizontal':
        next.y = movement.y
        break
      case 'vertical':
        next.x = movement.x
        break
    }

    setMovement(next)
    opt.onMove?.(next)
  }

  const updateCoordinate = (payload: { x: number; y: number }) => {
    lastCoordinate.current.x = payload.x
    lastCoordinate.current.y = payload.y

    setMovement({
      x: 0,
      y: 0,
    })
  }

  return {
    slots,
    isDragging,
    coordinate,
    updateCoordinate,
  }
}
