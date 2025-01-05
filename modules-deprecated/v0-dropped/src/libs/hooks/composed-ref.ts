import { useRef } from 'react'

/**
 * 데이터를 ref로 모을 때 사용
 */
export const useComposedRef = <Scope>(setScope: () => Scope) => {
    const scope = useRef(setScope())

    scope.current = setScope()

    return scope
}
