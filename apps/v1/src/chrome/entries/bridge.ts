import {
  appendScriptTag,
  appendStyleTag,
  createElements,
} from '@/chrome/utils/dom'
import { enableChromeBridge } from '@text-picker/core/chrome/bridge'
import { ChromeSDK } from '@text-picker/core/chrome/sdk'

init()

async function init() {
  const chromeSDK = new ChromeSDK()
  const { rootEl, shadowRoot } = createElements()

  appendStyleTag(shadowRoot, chromeSDK.getResourceUrl('assets/tab.css'))
  appendScriptTag(shadowRoot, chromeSDK.getResourceUrl('entries/tab.js'))

  document.body.appendChild(rootEl)

  enableChromeBridge()
}
