import { FC, useEffect } from 'react'
import * as styles from '~/components/Backdrop.styles'
import { cx } from '~/libs/emotion'
import { useLocalState } from '~/libs/hooks/local-state'

interface Props {
    activated?: boolean
    zIndex?: number
}

interface State {
    isDisplayed: boolean
    isVisiabled: boolean
}

const Backdrop: FC<Props> = (props) => {
    const isActivated = props?.activated ?? false
    const zIndex = props.zIndex ?? 0

    const [state, setState] = useLocalState<State>({
        isDisplayed: false,
        isVisiabled: false,
    })

    const show = () => {
        setState({
            isDisplayed: true,
        })

        window.requestAnimationFrame(() => {
            setState({
                isVisiabled: true,
            })
        })
    }

    const hide = () => {
        if (state.isDisplayed) {
            setState({
                isVisiabled: false,
            })
        }
    }

    const onTransitionEnd = () => {
        if (!state.isVisiabled) {
            setState({
                isDisplayed: false,
            })
        }
    }

    useEffect(() => {
        if (isActivated) {
            show()
            return
        }

        hide()
    }, [isActivated])

    return (
        <div
            className={cx(styles.container, {
                [styles.displayed]: state.isDisplayed,
                [styles.visiabled]: state.isVisiabled,
            })}
            style={{
                zIndex,
            }}
            onTransitionEnd={onTransitionEnd}
        />
    )
}

export default Backdrop
