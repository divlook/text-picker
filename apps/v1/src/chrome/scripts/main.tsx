import ChromeApp from '@/components/ChromeApp'
import { ChromeSDK } from '@text-picker/core/chrome/sdk'
import { createRoot } from 'react-dom/client'
import '@/tailwind.css'
import './content'

const rootEl = document.querySelector(`[data-appid="${ChromeSDK.APP_ID}"]`)
const appEl = rootEl?.shadowRoot?.querySelector('div[data-name="app"]')

if (appEl) {
  createRoot(appEl).render(<ChromeApp />)
}
