import { CHROME_APP_ID } from '@text-picker/core/chrome/contants'

export const createElements = () => {
  const rootEl = document.createElement('div')
  const appEl = document.createElement('div')
  const shadowRoot = rootEl.attachShadow({ mode: 'open' })

  rootEl.dataset.appid = CHROME_APP_ID
  appEl.dataset.name = 'app'
  shadowRoot.appendChild(appEl)

  return {
    rootEl,
    appEl,
    shadowRoot,
  }
}

export const getElements = () => {
  const rootEl =
    document.querySelector(`[data-appid="${CHROME_APP_ID}"]`) ?? null

  const shadowRoot = rootEl?.shadowRoot ?? null

  const appEl = shadowRoot?.querySelector('div[data-name="app"]') ?? null

  return {
    rootEl,
    appEl,
    shadowRoot,
  }
}

export const appendStyleTag = (node: DocumentFragment, href: string) => {
  const styleTag = document.createElement('link')

  styleTag.setAttribute('rel', 'stylesheet')
  styleTag.setAttribute('href', href)

  document.head.appendChild(styleTag)
  node.appendChild(styleTag)
}

export const appendScriptTag = (node: DocumentFragment, src: string) => {
  const scriptTag = document.createElement('script')

  scriptTag.type = 'module'
  scriptTag.src = src
  node.appendChild(scriptTag)
}
