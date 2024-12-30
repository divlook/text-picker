import { ChromeSDK } from '@text-picker/core/chrome/sdk'

init()

async function init() {
  const rootEl = document.createElement('div')
  const shadowRoot = rootEl.attachShadow({ mode: 'open' })
  const styleTag = document.createElement('link')
  const scriptTag = document.createElement('script')
  const appEl = document.createElement('div')

  rootEl.dataset.appid = ChromeSDK.APP_ID

  styleTag.setAttribute('rel', 'stylesheet')
  styleTag.setAttribute('href', ChromeSDK.resolveRuntimeUrl('assets/main.css'))

  scriptTag.type = 'module'
  scriptTag.src = ChromeSDK.resolveRuntimeUrl('main.js')

  appEl.dataset.name = 'app'

  document.body.appendChild(rootEl)
  shadowRoot.appendChild(styleTag)
  shadowRoot.appendChild(appEl)
  shadowRoot.appendChild(scriptTag)
}
