import '~/main.css'
import { App } from '~/components/App'

const app = new App()

document.body.appendChild(app.el)

document.querySelector('#btn')?.addEventListener('click', () => {
    app.start()
})
