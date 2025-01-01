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
import type { RetrievedNode } from '@text-picker/core/retrieved-node'
import { Retriever } from '@text-picker/core/retriever'
import classNames from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'

function TextPicker(_props: TextPickerSchema.Props.Input) {
  const props = TextPickerSchema.Props.parse(_props)

  const controlPanelEl = useRef<HTMLDivElement>(null)

  const guideBoxController = useRef<GuideBoxSchema.Controller>(null)

  const retriever = useRef(new Retriever())

  const toast = useToast()

  const [lastNode, updateLastNode] = useState<RetrievedNode | null>(null)

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

  const hasElements = useMemo(() => {
    return (lastNode?.elements.length || 0) > 0
  }, [lastNode?.elements.length])

  const elementBoundingRects = useMemo(() => {
    return (
      lastNode?.elements.map((el, index) => {
        return {
          key: `${index}_${Date.now()}`,
          rect: el.getBoundingClientRect(),
        }
      }) ?? []
    )
  }, [lastNode?.elements])

  const scope = useRef({
    boxLayout,
  })

  function onChangeBoxLayout(layout: BoundingBoxSchema) {
    setBoxLayout(layout)
    retriever.current.retrieve(layout)
  }

  function quit() {
    updateLastNode(null)
    props.onQuit?.()
  }

  useEffect(() => {
    retriever.current.on((node) => {
      updateLastNode(node)
    })

    window.addEventListener('resize', retrieveOnResize)

    return () => {
      retriever.current.clear()
      window.removeEventListener('resize', retrieveOnResize)
    }

    function retrieveOnResize() {
      if (!scope.current.boxLayout) {
        return
      }
      retriever.current.retrieve(scope.current.boxLayout)
    }
  }, [])

  useEffect(() => {
    if (props.displayed) {
      guideBoxController.current?.resetState()
    }
  }, [props.displayed])

  scope.current.boxLayout = boxLayout

  return (
    <div
      className={classNames(
        props.className,
        'fixed top-0 left-0 h-screen w-screen font-sans text-[16px]',
        {
          'pointer-events-none': !props.displayed,
        },
      )}
      style={{
        ...props.style,
        zIndex: props.zIndex,
      }}
      data-retriever-ignored
    >
      {elementBoundingRects.map(({ key, rect }) => (
        <div
          key={key}
          className="-outline-offset-1 absolute bg-dodger_blue/20 outline outline-1 outline-dodger_blue"
          style={{
            top: pixel(rect.top),
            left: pixel(rect.left),
            width: pixel(rect.width),
            height: pixel(rect.height),
          }}
        />
      ))}

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
                  disalbed={!hasElements}
                  onClick={async () => {
                    const { code, message } = (await lastNode?.copyText()) ?? {}

                    if (code === 'SUCCESS') {
                      toast.showMessage('Text copied')
                    } else if (message) {
                      toast.showMessage(message)
                    }
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
                    quit()
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
          onChangeBoxLayout(layout.absolute)
        }}
      />
    </div>
  )
}

export default TextPicker
