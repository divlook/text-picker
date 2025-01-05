import { HoleyDimmedFns } from '@/components/TextPicker/components/HoleyDimmed/fns'
import { HoleyDimmedSchema } from '@/components/TextPicker/components/HoleyDimmed/schema'
import classNames from 'classnames'
import { useMemo } from 'react'

function HoleyDimmed(_props: HoleyDimmedSchema.Props.Input) {
  const props = HoleyDimmedSchema.Props.parse(_props)

  const clipPath = useMemo(
    () => HoleyDimmedFns.generateClipPath(props.hole),
    [props.hole],
  )

  return (
    <div
      className={classNames(
        props.className,
        'bg-black/02 backdrop-blur-[2px] transition-opacity',
        {
          'opacity-0': !props.displayed,
          'pointer-events-none': !props.displayed,
        },
      )}
      style={{
        ...props.style,
        width: props.width,
        height: props.height,
        clipPath,
      }}
    />
  )
}

export default HoleyDimmed
