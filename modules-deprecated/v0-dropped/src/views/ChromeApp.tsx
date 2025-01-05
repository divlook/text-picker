import { FC, useCallback, useEffect } from 'react'
import TextPicker from '~/components/TextPicker'
import { useSmartState } from '~/libs/hooks/smart-state'
import { Outline } from '~/libs/global/types'
import { ActionType } from '~/chrome/types'
import { makeChromeMessage, parseChromeMessage } from '~/chrome/events'
import { copyText, crop, debounce } from '~/libs/utils'
import { textRecognize } from '~/libs/ocr'

const ChromeApp: FC = () => {
    const [state, setState, stateRef] = useSmartState({
        blocks: [] as Outline[],
        texts: [] as string[],
        isRunning: false,
        isHidden: false,
        pickerOutline: null as Outline | null,
    })

    const start = () => {
        setState({
            isRunning: true,
        })
    }

    const clear = () => {
        setState({
            isRunning: false,
            blocks: [],
            texts: [],
        })
    }

    const toggle = () => {
        if (state.isRunning) {
            clear()
            return
        }

        start()
    }

    const capture = () => {
        setState({
            isHidden: true,
        })

        window.requestAnimationFrame(() => {
            chrome.runtime.sendMessage(
                makeChromeMessage({
                    type: ActionType.Capture,
                }),
            )
        })
    }

    const onCapture = async (dataUri?: string) => {
        const { pickerOutline } = stateRef.current

        if (!dataUri || pickerOutline === null) {
            return
        }

        const img = await crop(dataUri, pickerOutline)

        setState({
            isHidden: false,
        })

        const data = await textRecognize(img)

        const texts: string[] = []
        const blocks = (data.paragraphs ?? []).map((row) => {
            const { bbox, text } = row

            texts.push(text)

            return {
                x: pickerOutline.x + bbox.x0,
                y: pickerOutline.y + bbox.y0,
                width: bbox.x1 - bbox.x0,
                height: bbox.y1 - bbox.y0,
            }
        })

        setState({
            blocks,
            texts,
        })
    }

    const onMove = useCallback(
        debounce(1000, (outline: Outline) => {
            if (outline.width * outline.height) {
                setState({
                    pickerOutline: outline,
                })
                capture()
            }
        }),
        [],
    )

    const onBlockClick = (_: Outline, index: number) => {
        const text = stateRef.current.texts[index]

        if (text) {
            copyText(text).then(() => {
                window.alert('Copied')
            })
        }
    }

    const onChromeMessage = useCallback((message: unknown) => {
        const action = parseChromeMessage(message)

        if (action === null) return

        const { type } = action

        switch (type) {
            case ActionType.Toggle: {
                toggle()
                break
            }

            case ActionType.CaptureResult: {
                onCapture(action.dataUri)
                break
            }
        }
    }, [])

    const onWindowScroll = () => {
        clear()
    }

    useEffect(() => {
        chrome.runtime.onMessage.addListener(onChromeMessage)
        window.addEventListener('scroll', onWindowScroll)

        return () => {
            chrome.runtime.onMessage.removeListener(onChromeMessage)
            window.removeEventListener('scroll', onWindowScroll)
        }
    }, [])

    return (
        <TextPicker
            blocks={state.blocks}
            running={state.isRunning}
            hidden={state.isHidden}
            onUpdateRunning={(isRunning) => {
                if (isRunning) {
                    start()
                } else {
                    clear()
                }
            }}
            onMove={(outline) => onMove(outline)}
            onBlockClick={(outline, index) => onBlockClick(outline, index)}
        />
    )
}

export default ChromeApp
