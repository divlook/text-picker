import { ButtonFns } from '@/components/Button/fns'
import { ButtonSchema } from '@/components/Button/schema'
import classNames from 'classnames'

function Button(_props: ButtonSchema.PropsInput) {
  const props = ButtonSchema.Props.parse(_props)

  return (
    <button
      className={classNames(
        props.className,
        'rounded border bg-white/40 px-2 py-1 font-medium shadow backdrop-blur active:text-white',
        props.disalbed && 'opacity-40',
        [
          props.theme === 'primary' && [
            'border-dodger_blue/50 text-dodger_blue',
            !props.disalbed &&
              'hover:border-dodger_blue active:bg-dodger_blue/30',
          ],
          props.theme === 'danger' && [
            'border-red-500/50 text-red-500',
            !props.disalbed && 'hover:border-red-500 active:bg-red-500/30',
          ],
        ],
      )}
      style={{
        ...props.style,
      }}
      type="button"
      disabled={props.disalbed}
      onClick={props.onClick}
    >
      {ButtonFns.getLabelJSX(props.label)}
    </button>
  )
}

export default Button
