import { useEffect, useState } from 'react'

/**
 * 단순한 setState
 */
export const useSimpleState = <State = {}>(
    initialState: State,
    onBeforeUpdate?: (prev: State, next: Partial<State>) => State,
    onUpdated?: (state: State) => void,
) => {
    const [state, setState] = useState(initialState)

    const dispatch = (next: Partial<State>) => {
        setState((prev) => {
            if (typeof onBeforeUpdate === 'function') {
                return onBeforeUpdate(prev, next)
            }

            return {
                ...prev,
                ...next,
            }
        })
    }

    useEffect(() => {
        onUpdated?.(state)
    }, [state])

    return [state, dispatch] as const
}
