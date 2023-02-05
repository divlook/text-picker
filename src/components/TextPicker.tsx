import { FC, useEffect } from 'react'
import GuideBox from '~/components/GuideBox'
import { getZIndex } from '~/libs/utils'
import { Props, State } from '~/components/TextPicker.types'
import * as styles from '~/components/TextPicker.styles'
import { useSmartState } from '~/libs/hooks/smart-state'
import TextBlock from '~/components/TextBlock'

const TextPicker: FC<Props> = (props) => {
    const [state, setState] = useSmartState<State>(
        {
            zIndex: 0,
            isRunning: props.running ?? false,
        },
        (prev, next) => {
            const nextState = { ...prev, ...next }

            if (
                next.isRunning !== undefined &&
                prev.isRunning !== next.isRunning
            ) {
                props.onUpdateRunning?.(next.isRunning)
            }

            return nextState
        },
    )

    const start = () => {
        setEnableBodyScrollbar(false)

        setState({
            zIndex: getZIndex(document.body) + 1,
            isRunning: true,
        })
    }

    const end = () => {
        setEnableBodyScrollbar(true)

        setState({
            isRunning: false,
        })
    }

    const setEnableBodyScrollbar = (isEnabled: boolean) => {
        if (isEnabled) {
            if (document.body.classList.contains(styles.globalBody)) {
                document.body.classList.remove(styles.globalBody)
            }
            return
        }

        if (!document.body.classList.contains(styles.globalBody)) {
            document.body.classList.add(styles.globalBody)
        }
    }

    useEffect(() => {
        if (props.running) {
            start()
            return
        }

        end()
    }, [props.running])

    return (
        <>
            {state.isRunning && (
                <GuideBox
                    zIndex={state.zIndex}
                    onEnd={end}
                    onUpdateOutline={props.onMove}
                    //
                />
            )}

            {props.blocks?.map((outline, key) => (
                <TextBlock
                    key={key}
                    zIndex={state.zIndex - 1}
                    outline={outline}
                    onClick={
                        props.onBlockClick &&
                        (() => props.onBlockClick?.(outline, key))
                    }
                    //
                />
            ))}
        </>
    )
}

export default TextPicker
