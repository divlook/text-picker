/**
 * @see https://developer.chrome.com/extensions/devguide
 * @see https://developer.chrome.com/extensions/background_pages
 * @see https://developer.chrome.com/extensions/messaging
 * @see https://developer.chrome.com/extensions/tabs
 */
export namespace ChromeSDK {
  export const APP_ID = '@divlook/text-picker'

  export function initBackground() {
    chrome.action.onClicked.addListener((tab) => {
      sendChromeMessage(tab.id)
    })
  }

  export function initContent(options?: {
    onMessage?: (action: 'toggle') => void
  }) {
    chrome.runtime.onMessage.addListener((payload) => {
      window.postMessage({
        appId: APP_ID,
        payload,
      })

      return true
    })

    window.addEventListener('message', (event) => {
      const data = event.data

      if (data.appId !== ChromeSDK.APP_ID) {
        return
      }

      switch (data.payload?.action) {
        case 'toggle':
          options?.onMessage?.(data.payload.action)

          break
      }
    })
  }

  export function resolveRuntimeUrl(path: string) {
    return chrome.runtime.getURL(path)
  }

  function getActiveTabId() {
    return new Promise<number | null>((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTabId = tabs[0].id || null

        resolve(activeTabId)
      })
    })
  }

  async function sendChromeMessage(tabId: number | null = null) {
    const activeTabId = tabId || (await getActiveTabId())

    if (!activeTabId) {
      return
    }

    chrome.tabs.sendMessage(activeTabId, {
      action: 'toggle',
    })
  }
}
