import { ToastSchema } from '@/components/Toast/schema'
import { useRef, useState } from 'react'

export function useToast(_options: ToastSchema.Options.Input = {}) {
  const options = ToastSchema.Options.parse(_options)

  const timerId = useRef<ReturnType<typeof setTimeout>>()

  const [isDisplayed, updateDisplayStatus] = useState(false)
  const [message, setMessage] = useState('')

  const controller: ToastSchema.Controller = {
    isDisplayed,
    message,
    showMessage: (nextMessage: string) => {
      clearTimeout(timerId.current)

      setMessage(nextMessage)
      updateDisplayStatus(true)

      timerId.current = setTimeout(() => {
        updateDisplayStatus(false)
      }, options.dismissTime)
    },
    dismiss: () => {
      updateDisplayStatus(false)
      clearTimeout(timerId.current)
    },
  }

  return controller
}
