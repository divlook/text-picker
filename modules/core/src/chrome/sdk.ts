import { CHROME_APP_ID } from '@/chrome/contants.js'
import type { ChromeSchema } from '@/chrome/schema.js'

/**
 * @see https://developer.chrome.com/extensions/devguide
 * @see https://developer.chrome.com/extensions/background_pages
 * @see https://developer.chrome.com/extensions/messaging
 * @see https://developer.chrome.com/extensions/tabs
 */
export class ChromeSDK {
  constructor() {
    if (typeof chrome === 'undefined') {
      throw new Error('Chrome SDK is not available')
    }
  }

  getResourceUrl(path: string) {
    return chrome.runtime.getURL(path)
  }

  getActiveTabId() {
    return new Promise<number | null>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTabId = tabs[0].id || null

        resolve(activeTabId)
      })
    })
  }

  async sendMessageToTab(payload: {
    tabId?: number
    action: ChromeSchema.Action
  }) {
    const activeTabId = payload.tabId ?? (await this.getActiveTabId())

    if (!activeTabId) {
      return
    }

    chrome.tabs.sendMessage(activeTabId, {
      action: payload.action,
    })
  }

  addClickListenerToActionIcon(
    actionIconClickHandler: (tab: chrome.tabs.Tab) => void,
  ) {
    chrome.action.onClicked.addListener((tab) => {
      actionIconClickHandler(tab)
    })

    return {
      remove() {
        chrome.action.onClicked.removeListener(actionIconClickHandler)
      },
    }
  }

  initializeBridge() {
    const callback = (payload: ChromeSchema.MessagePayload) => {
      window.postMessage({
        appId: CHROME_APP_ID,
        payload,
      } as ChromeSchema.Message)

      return true
    }

    chrome.runtime.onMessage.addListener(callback)

    return {
      remove() {
        chrome.runtime.onMessage.removeListener(callback)
      },
    }
  }
}
