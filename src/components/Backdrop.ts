import { css } from '~/emotion'
import { MicroElement } from '~/micro-element'

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

export default class Backdrop extends MicroElement {
    el = document.createElement('span')

    private isActive = false

    render() {
        if (this.isActive) {
            this.showAnimation()
            return
        }

        this.hideAnimation()
    }

    private showAnimation() {
        this.el.className = MicroElement.classes([
            styles.container,
            {
                [styles.display]: true,
            },
        ])

        MicroElement.nextTick(() => {
            this.el.className = MicroElement.classes([
                styles.container,
                {
                    [styles.display]: true,
                    [styles.active]: true,
                },
            ])
        })
    }

    private hideAnimation() {
        this.el.className = MicroElement.classes(styles.container, {
            [styles.display]: true,
            [styles.active]: false,
        })

        MicroElement.nextTick(() => {
            this.el.className = MicroElement.classes(styles.container, {
                [styles.display]: false,
            })
        })
    }

    setActive(active: boolean) {
        this.isActive = active
        this.render()
    }
}
