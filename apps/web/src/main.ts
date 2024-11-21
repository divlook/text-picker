import { Header } from '@pkg/ui/header'
import './style.css'
import typescriptLogo from '/typescript.svg'
import { Counter } from '@pkg/ui/counter'
import { setupCounter } from '@pkg/ui/setup-counter'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    ${Header({ title: 'Web' })}
    <div class="card">
      ${Counter()}
    </div>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
