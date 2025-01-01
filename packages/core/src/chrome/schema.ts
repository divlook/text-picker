import type { CHROME_APP_ID } from '@/chrome/contants.js'
import { z } from 'zod'

export namespace ChromeSchema {
  export const Action = z.enum(['toggle'])
  export type Action = z.infer<typeof Action>

  export const Message = z.object({
    appId: z.custom<typeof CHROME_APP_ID>(),
    payload: z.object({
      action: Action,
    }),
  })
  export type Message = z.infer<typeof Message>

  export const MessagePayload = z.object({
    action: Action,
  })
  export type MessagePayload = z.infer<typeof MessagePayload>
}
