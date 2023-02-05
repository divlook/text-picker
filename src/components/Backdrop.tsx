import { FC, useEffect } from 'react'
import * as styles from '~/components/Backdrop.styles'
import { Props, State } from '~/components/Backdrop.types'
import { cx } from '~/libs/emotion'
import { useSmartState } from '~/libs/hooks/smart-state'

const Backdrop: FC<Props> = (props) => {
    const isActivated = props?.activated ?? false
    const zIndex = props.zIndex ?? 0

    const [state, setState] = useSmartState<State>({
        isDisplayed: false,
        isVisiabled: false,
    })

    const show = () => {
        setState({
            isDisplayed: true,
        })

        setTimeout(() => {
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
                [styles.displayed]: state.isDisplayed && !props.hidden,
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
