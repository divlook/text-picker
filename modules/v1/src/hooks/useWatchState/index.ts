import { useDeferredValue, useEffect } from 'react'

export function useWatchState<Value>(
  value: Value,
  callback: ((oldValue?: Value) => () => void) | ((oldValue?: Value) => void),
) {
  const oldValue = useDeferredValue(value)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (oldValue === value) {
      return
    }

    const cleanUp = callback(oldValue)

    return () => {
      cleanUp?.()
    }
  }, [value])
}
