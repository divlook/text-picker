import { ChromeSDK } from '@/chrome/sdk.js'

export function enableChromeBackground() {
  const chromeSDK = new ChromeSDK()

  const actionIconClickListener = chromeSDK.addClickListenerToActionIcon(
    (tab) => {
      chromeSDK.sendMessageToTab({
        tabId: tab.id,
        action: 'toggle',
      })
    },
  )

  return {
    disable() {
      actionIconClickListener.remove()
    },
  }
}
