import { FC } from 'react'
import { Props } from '~/components/TextBlock.types'
import * as styles from '~/components/TextBlock.styles'
import { classes } from '~/libs/utils'

const TextBlock: FC<Props> = (props) => {
    return (
        <>
            <div
                className={classes(styles.block, {
                    [styles.cursorPointer]: typeof props.onClick === 'function',
                    [styles.hidden]: props.hidden ?? false,
                })}
                style={{
                    top: props.outline.y,
                    left: props.outline.x,
                    width: props.outline.width,
                    height: props.outline.height,
                    zIndex: props.zIndex ?? 0,
                }}
                onClick={() => props.onClick?.(props.outline)}
            />
        </>
    )
}

export default TextBlock
