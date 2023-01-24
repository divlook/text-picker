import { CHROME_ACTION_NAME } from '~/chrome/constants'
import { makeChromeMessage, parseChromeMessage } from '~/chrome/events'

const state = {
    tabId: 0,
}

chrome.action.onClicked.addListener((tab) => {
    const tabId = tab.id

    if (tabId) {
        state.tabId = tabId

        chrome.tabs.sendMessage(
            tabId,
            makeChromeMessage(CHROME_ACTION_NAME.TOGGLE)()
        )
    }
})

chrome.runtime.onMessage.addListener(async (message) => {
    if (!state.tabId) return

    const data = parseChromeMessage(message)

    switch (data.action) {
        case CHROME_ACTION_NAME.CAPTURE: {
            try {
                const dataUri = await chrome.tabs.captureVisibleTab({
                    format: 'png',
                })

                chrome.tabs.sendMessage(
                    state.tabId,
                    makeChromeMessage(CHROME_ACTION_NAME.CAPTURE)(dataUri)
                )
            } catch (error) {
                console.error(error)

                chrome.tabs.sendMessage(
                    state.tabId,
                    makeChromeMessage(CHROME_ACTION_NAME.CAPTURE)()
                )
            }
            break
        }
    }
})
