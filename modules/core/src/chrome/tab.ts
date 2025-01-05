import { CHROME_APP_ID } from '@/chrome/contants.js'
import { ChromeSchema } from '@/chrome/schema.js'

export function enableChromeTab(options?: {
  onMessage?: (action: 'toggle') => void
}) {
  const onMessageReceived = (event: MessageEvent) => {
    const { data } = ChromeSchema.Message.safeParse(event.data)

    if (!data || data.appId !== CHROME_APP_ID) {
      return
    }

    switch (data.payload.action) {
      case 'toggle':
        options?.onMessage?.(data.payload.action)

        break
    }
  }

  window.addEventListener('message', onMessageReceived)

  return {
    disable() {
      window.removeEventListener('message', onMessageReceived)
    },
  }
}
