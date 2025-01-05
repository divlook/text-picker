import { ChromeSDK } from '@/chrome/sdk.js'

export function enableChromeBridge() {
  const chromeSDK = new ChromeSDK()

  const bridge = chromeSDK.initializeBridge()

  return {
    disable() {
      bridge.remove()
    },
  }
}
