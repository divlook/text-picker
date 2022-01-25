/**
 * @param duration 단위 ms
 */
export const throttle = <Callback extends (...args: any[]) => void>(
    duration: number,
    callback: Callback
) => {
    const lastCallback = debounce(duration, callback)

    let prevTime = 0

    return (...args: Parameters<Callback>) => {
        const currentTime = Date.now()

        const diff = currentTime - prevTime

        if (diff >= duration) {
            prevTime = currentTime

            callback(...args)
        } else {
            lastCallback(...args)
        }
    }
}

/**
 * @param duration 단위 ms
 */
export const debounce = <Callback extends (...args: any[]) => void>(
    duration: number,
    callback: Callback
) => {
    let timerId = 0

    return (...args: Parameters<Callback>) => {
        clearTimeout(timerId)

        timerId = window.setTimeout(() => {
            callback(...args)
        }, duration)
    }
}
