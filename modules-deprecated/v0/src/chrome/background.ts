import { MESSAGE_TYPE } from '~/chrome/constants'

chrome.action.onClicked.addListener((tab) => {
    if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
            type: MESSAGE_TYPE,
            action: 'toggle',
        })
    }
})
