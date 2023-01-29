import { useReducer } from 'react'

/**
 * 단순한 setState
 */
export const useSimpleState = <State = {}>(initialState: State) => {
    return useReducer(
        (prev: State, next: Partial<State>) => ({
            ...prev,
            ...next,
        }),
        initialState,
    )
}
