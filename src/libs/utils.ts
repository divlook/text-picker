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

/**
 *
 * @param hex #000, #000000
 * @param alpha 100, 0 ~ 100
 * @returns rgb(0 0 0 / 100%)
 */
export const rgb = (hex: `#${string}`, alpha = 100) => {
    const code = hex.slice(1)

    const isCompressed = code.length === 3

    const arr: number[] = []

    for (let i = 0; i < 3; i++) {
        const start = i * (isCompressed ? 1 : 2)
        const end = start + (isCompressed ? 1 : 2)
        const repeat = isCompressed ? 2 : 1
        const value = code.slice(start, end).repeat(repeat)

        arr.push(parseInt(value, 16))
    }

    return `rgb(${arr.join(' ')} / ${Math.min(alpha, 100)}%)`
}

/**
 * Get z-index
 *
 * `position`이 'static'이 아닌 요소, 즉 'relative', 'absolute', 'fixed', 'sticky'의 z-index를 가져옴
 */
export const getZIndex = (el: HTMLElement): number => {
    const style = window.getComputedStyle(el)

    const zIndex = parseInt(style.zIndex) || 0
    const position = style.position

    if (style.display === 'none') {
        return zIndex
    }

    if (position === 'static') {
        const children = Array.from(el.children) as HTMLElement[]

        return children.reduce((zIndex, child) => {
            return Math.max(zIndex, getZIndex(child))
        }, 0)
    }

    return zIndex
}
