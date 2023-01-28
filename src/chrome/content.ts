import { CHROME_ACTION_NAME } from '~/chrome/constants'
import { parseChromeMessage } from '~/chrome/events'
import { App } from '~/legacy/components/App'

const app = new App()

window.addEventListener('load', setup)

function setup() {
    document.body.appendChild(app.el)

    chrome.runtime.onMessage.addListener((message) => {
        const data = parseChromeMessage(message)

        switch (data.action) {
            case CHROME_ACTION_NAME.TOGGLE: {
                toggle()
                break
            }

            case CHROME_ACTION_NAME.CAPTURE: {
                app.emit('capture', data.payload.dataUri)
                break
            }
        }
    })

    window.addEventListener('scroll', () => {
        app.clear()
    })
}

function toggle() {
    if (app.isActive) {
        app.clear()
        return
    }

    app.start()
}
