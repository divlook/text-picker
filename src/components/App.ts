import { cx, css } from '../emotion'
import GuideBox from './GuideBox'
import Backdrop from './Backdrop'

interface Pos {
    top: number
    left: number
    right: number
    bottom: number
}

const styles = {
    container: css(),
    crosshair: css({
        cursor: 'crosshair',
    }),
}

export default class App {
    el
    backdrop = new Backdrop()
    guideBox = new GuideBox()

    #active = false

    #coordinates: [number, number][] = []

    #includeElements = new Map<Element, Pos>()

    #cachedElements = new Set<Element>()

    constructor() {
        this.el = document.createElement('div')

        this.#render()

        this.el.appendChild(this.backdrop.el)
        this.el.appendChild(this.guideBox.el)

        window.addEventListener(
            'click',
            (ev) => {
                if (this.#active) {
                    this.setPoint(ev.x, ev.y)
                }
            },
            true
        )
    }

    #render() {
        this.el.className = cx(styles.container)
    }

    start() {
        window.requestAnimationFrame(() => {
            this.#active = true
            this.#coordinates = []
            this.#includeElements.clear()
            this.#cachedElements.clear()

            if (document.body.classList.contains(styles.crosshair)) {
                document.body.classList.remove(styles.crosshair)
            }

            document.body.classList.add(styles.crosshair)

            this.backdrop.setActive(true)
        })
    }

    /**
     * 가이드상자의 시작점과 끝점을 찍는 함수
     */
    setPoint(x: number, y: number) {
        this.backdrop.setActive(false)

        this.#coordinates.push([x, y])

        if (this.#coordinates.length === 2) {
            this.#active = false
            document.body.classList.remove(styles.crosshair)
        }
    }

    parseElements() {
        if (this.#coordinates.length < 2) {
            return
        }

        const [[startX, startY], [endX, endY]] = this.#coordinates

        for (let x = startX; x <= endX; x += 10) {
            for (let y = startY; y <= endY; y += 10) {
                const el = document.elementFromPoint(x, y)

                if (!el) continue
                if (this.#cachedElements.has(el)) continue

                const prevTargets: HTMLElement[] = []
                let target = el as HTMLElement | null

                /**
                 * display가 inline인경우 target을 parent로 변경
                 */
                while (target) {
                    const display = window.getComputedStyle(target).display

                    if (!display.includes('inline')) {
                        break
                    }

                    this.#cachedElements.add(target) // 다시 검색하지 않도록 캐싱
                    target = target.parentElement
                }

                /**
                 * block 요소가 없으면 건너뜀
                 */
                if (!target) {
                    continue
                }

                let current = target as HTMLElement | null
                let isSkip = false
                let top = 0
                let left = 0
                let right = 0
                let bottom = 0

                /**
                 * offset 계산
                 */
                while (current) {
                    /**
                     * parent 중 사용된게 있으면 건너뜀
                     */
                    if (this.#includeElements.has(current)) {
                        isSkip = true
                        prevTargets.forEach((el) => this.#includeElements.delete(el))
                        break
                    }

                    prevTargets.push(current)

                    top += current.offsetTop
                    left += current.offsetLeft
                    current = current.offsetParent as HTMLElement | null
                }

                if (isSkip) {
                    continue
                }

                right = left + target.clientWidth
                bottom = top + target.clientHeight

                if (left < startX) continue
                if (right > endX) continue
                if (bottom > endY) continue
                if (top < startY) continue

                this.#includeElements.set(target, {
                    top,
                    left,
                    right,
                    bottom,
                })
            }
        }
    }
}
