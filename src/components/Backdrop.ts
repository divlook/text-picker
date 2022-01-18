import { cx, css } from '~/emotion'

const styles = {
    container: css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: `rgba(0, 0, 0, ${0.4})`,
        opacity: 0,
        transition: 'opacity 0.5s',
        display: 'none',
    }),
    active: css({
        opacity: 1,
    }),
    display: css({
        display: 'block',
    }),
}

export default class Backdrop {
    el

    #active = false

    constructor() {
        this.el = document.createElement('div')

        this.#render()
    }

    #render() {
        if (this.#active) {
            this.#showAnimation()
            return
        }

        this.#hideAnimation()
    }

    #showAnimation() {
        this.el.className = [
            styles.container,
            cx({
                [styles.display]: true,
            }),
        ].join(' ')

        window.requestAnimationFrame(() => {
            this.el.className = [
                styles.container,
                cx({
                    [styles.display]: true,
                    [styles.active]: true,
                }),
            ].join(' ')
        })
    }

    #hideAnimation() {
        this.el.className = cx(styles.container, {
            [styles.display]: true,
            [styles.active]: false,
        })

        window.requestAnimationFrame(() => {
            this.el.className = cx(styles.container, {
                [styles.display]: false,
            })
        })
    }

    setActive(active: boolean) {
        this.#active = active
        this.#render()
    }
}
