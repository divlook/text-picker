import ChromeApp from '@/components/ChromeApp'
import { createRoot } from 'react-dom/client'
import '@/style/tailwind.css'
import { getElements } from '@/chrome/utils/dom'

const { appEl } = getElements()

if (appEl) {
  createRoot(appEl).render(<ChromeApp />)
}
