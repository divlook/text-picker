import { useEffect, useRef, useState } from 'react'

/**
 * useSmartState
 *
 * @returns [state, dispatch, stateRef]
 */
export const useSmartState = <State = {}>(
    initialState: State,
    onBeforeUpdate?: (prev: State, next: Partial<State>) => State,
    onUpdated?: (state: State) => void,
) => {
    const [state, setState] = useState(initialState)

    const stateRef = useRef(state)

    const dispatch = (
        next: Partial<State> | ((state: State) => Partial<State>),
    ) => {
        setState((prev) => {
            if (typeof next === 'function') {
                next = next(prev)
            }

            if (typeof onBeforeUpdate === 'function') {
                return onBeforeUpdate(prev, next)
            }

            return {
                ...prev,
                ...next,
            }
        })
    }

    stateRef.current = state

    useEffect(() => {
        onUpdated?.(state)
    }, [state])

    return [state, dispatch, stateRef] as const
}
