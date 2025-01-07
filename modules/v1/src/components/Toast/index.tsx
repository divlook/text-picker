import { ToastSchema } from '@/components/Toast/schema'
import classNames from 'classnames'
import { type CSSProperties, useMemo } from 'react'

function Toast(_props: ToastSchema.Props.Input) {
  const props = ToastSchema.Props.parse(_props)

  const containerStyle = useMemo(() => {
    const style: CSSProperties = {}
    const top = props.displayed ? 0 : 20
    const opacity = props.displayed ? 1 : 0

    style.translate = `0 ${top}%`
    style.opacity = opacity

    return style
  }, [props.displayed])

  return (
    <div
      className={classNames(
        'rounded-lg border shadow-lg backdrop-blur',
        'transition-[opacity,translate]',
        'border-black/50 bg-black/40 px-3 py-2 text-white',
        props.inline ? 'inline-flex' : 'flex',
      )}
      style={containerStyle}
    >
      {typeof props.wrapperJSX === 'function'
        ? props.wrapperJSX({
            message: props.message,
          })
        : props.message}
    </div>
  )
}

export default Toast
