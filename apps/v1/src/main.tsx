import Demo from '@/components/Demo'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/tailwind.css'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Demo />,
  </StrictMode>,
)
