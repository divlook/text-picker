import Button from '@/components/Button'
import GuideBox from '@/components/TextPicker/components/GuideBox'
import { GuideBoxConst } from '@/components/TextPicker/components/GuideBox/const'
import type { GuideBoxSchema } from '@/components/TextPicker/components/GuideBox/schema'
import HoleyDimmed from '@/components/TextPicker/components/HoleyDimmed'
import { TextPickerFns } from '@/components/TextPicker/fns'
import { TextPickerSchema } from '@/components/TextPicker/schema'
import Toast from '@/components/Toast'
import { useToast } from '@/components/Toast/hooks'
import { type BoundingBoxSchema, pixel } from '@text-picker/core'
import classNames from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'

/*

TODO: 탐색 코어 기능 구현
TODO: 탐색된 요소가 없으면 버튼 비활성화
TODO: 버튼 클릭하면
  TODO: 내용 복사 후 토스트 출력
  TODO: 이벤트 발생

*/

function TextPicker(_props: TextPickerSchema.Props.Input) {
  const props = TextPickerSchema.Props.parse(_props)

  const controlPanelEl = useRef<HTMLDivElement>(null)

  const guideBoxController = useRef<GuideBoxSchema.Controller>(null)

  const toast = useToast()

  const [boxLayout, setBoxLayout] = useState<BoundingBoxSchema | null>(null)

  const controlPanelStyle = useMemo(
    () =>
      TextPickerFns.calculateControlPanelStyle({
        boxLayout,
        controlPanelEl,
      }),
    [boxLayout],
  )

  const toastStyle = useMemo(
    () => TextPickerFns.calculateToastStyle({ boxLayout }),
    [boxLayout],
  )

  useEffect(() => {
    if (props.displayed) {
      guideBoxController.current?.resetState()
    }
  }, [props.displayed])

  return (
    <div
      className={classNames(
        props.className,
        'fixed top-0 left-0 h-screen w-screen',
        !props.displayed && 'pointer-events-none',
      )}
      style={{
        ...props.style,
        zIndex: props.zIndex ?? 'auto',
      }}
    >
      <HoleyDimmed
        className="absolute top-0 left-0 z-[1]"
        displayed={props.displayed}
        hole={boxLayout}
      />

      <div
        ref={controlPanelEl}
        hidden={!controlPanelStyle}
        className={classNames(
          'absolute z-[2] flex flex-wrap gap-2 transition-opacity',
          !props.displayed && 'opacity-0',
        )}
        style={controlPanelStyle}
      >
        {props.actions.map((action) => {
          switch (action) {
            case 'copy-text': {
              return (
                <Button
                  key={action}
                  theme="primary"
                  label="Copy text"
                  onClick={() => {
                    // TODO: 내용 복사 후 토스트 출력
                    toast.showMessage('Text copied')
                  }}
                />
              )
            }
            case 'copy-html': {
              return (
                <Button
                  key={action}
                  theme="primary"
                  label="Copy HTML"
                  onClick={() => {
                    // TODO: 내용 복사 후 토스트 출력
                    toast.showMessage('HTML copied')
                  }}
                />
              )
            }
            case 'quit': {
              return (
                <Button
                  key={action}
                  theme="danger"
                  label="Quit"
                  onClick={() => {
                    // TODO: 이벤트 발생
                  }}
                />
              )
            }
          }
        })}
      </div>

      <div
        className={classNames(
          'pointer-events-none absolute z-[3] transition-opacity',
          !props.displayed && 'opacity-0',
        )}
        style={toastStyle}
      >
        <Toast
          message={toast.message}
          displayed={toast.isDisplayed}
        />
      </div>

      <GuideBox
        controllerRef={guideBoxController}
        className={classNames(
          'z-[4] transition-opacity',
          !props.displayed && 'opacity-0',
        )}
        style={{
          top: `calc(50% - ${pixel(GuideBoxConst.MIN_HEIGHT / 2)})`,
          left: `calc(50% - ${pixel(GuideBoxConst.MIN_WIDTH / 2)})`,
        }}
        inactive={!props.displayed}
        onLayout={(layout) => {
          setBoxLayout(layout.absolute)
        }}
      />
    </div>
  )
}

export default TextPicker
