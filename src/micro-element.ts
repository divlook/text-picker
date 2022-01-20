import {
    MicroElementEmitMethod,
    MicroElementOffMethod,
    MicroElementOnMethod,
} from '~/interfaces'

export abstract class MicroElement {
    el: HTMLElement = document.createElement('div')

    private eventMap = new Map<string, Set<() => void>>()

    constructor() {
        this.emit('created')

        window.requestAnimationFrame(() => {
            this.render()

            window.requestAnimationFrame(() => {
                this.mounted()

                this.emit('mounted')
            })
        })
    }

    get emit(): MicroElementEmitMethod {
        return (eventName) => {
            const callbackSet = this.getCallbackSet(eventName)
            const callbacks = Array.from(callbackSet)

            for (const cb of callbacks) {
                try {
                    cb()
                } catch (error) {
                    console.error(error)
                    break
                }
            }
        }
    }

    get on(): MicroElementOnMethod {
        return (eventName: string, callback: () => void) => {
            const callbackSet = this.getCallbackSet(eventName)

            callbackSet.add(callback)

            this.eventMap.set(eventName, callbackSet)
        }
    }

    get off(): MicroElementOffMethod {
        return (eventName?: string, callback?: () => void) => {
            if (!eventName) {
                this.eventMap.clear()
                return
            }

            const callbackSet = this.getCallbackSet(eventName)

            if (!callback) {
                this.eventMap.delete(eventName)
                return
            }

            callbackSet.delete(callback)

            this.eventMap.set(eventName, callbackSet)
        }
    }

    get destroy() {
        return () => {
            const el: HTMLElement = this.el as any

            this.off()

            el?.remove()
        }
    }

    /**
     * 최초 렌더링된 이후 콜백
     */
    protected mounted() {}

    /**
     * DOM 렌더링
     *
     * DOM 변경은 모두 이 함수를 사용
     */
    abstract render(): void

    private getCallbackSet(eventName: string) {
        const callbackSet = this.eventMap.get(eventName) || new Set()

        return callbackSet
    }
}
