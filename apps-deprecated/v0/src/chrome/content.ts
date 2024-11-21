import { MESSAGE_TYPE } from '~/chrome/constants'
import { App } from '~/components/App'

const app = new App()

window.addEventListener('load', setup)

function setup() {
    document.body.appendChild(app.el)

    chrome.runtime.onMessage.addListener((request) => {
        const type = request?.type
        const action = request?.action

        if (type !== MESSAGE_TYPE) {
            return
        }

        switch (action) {
            case 'toggle': {
                toggle()
                break
            }
        }
    })
}

function toggle() {
    if (app.isActive) {
        app.clear()
        return
    }

    app.start()
}
