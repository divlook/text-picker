import { ActionType } from '~/chrome/types'
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
            makeChromeMessage({
                type: ActionType.Toggle,
            }),
        )
    }
})

chrome.runtime.onMessage.addListener(async (message) => {
    if (!state.tabId) return

    const action = parseChromeMessage(message)

    if (action === null) return

    const { type } = action

    switch (type) {
        case ActionType.Capture: {
            try {
                const dataUri = await chrome.tabs.captureVisibleTab({
                    format: 'png',
                })

                chrome.tabs.sendMessage(
                    state.tabId,
                    makeChromeMessage({
                        type: ActionType.CaptureResult,
                        dataUri,
                    }),
                )
            } catch (error) {
                console.error(error)

                chrome.tabs.sendMessage(
                    state.tabId,
                    makeChromeMessage({
                        type: ActionType.CaptureResult,
                    }),
                )
            }
            break
        }
    }
})
