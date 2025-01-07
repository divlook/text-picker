import { createRoot } from 'react-dom/client'
import ChromeApp from '~/views/ChromeApp'

window.addEventListener('load', setup)

function setup() {
    const rootEl = document.createElement('div')

    document.body.appendChild(rootEl)

    createRoot(rootEl).render(<ChromeApp />)
}
