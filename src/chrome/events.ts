import { CHROME_ACTION_NAME, CHROME_MESSAGE_TYPE } from '~/chrome/constants'

export const makeChromeMessage = (action: CHROME_ACTION_NAME) => {
    switch (action) {
        case CHROME_ACTION_NAME.TOGGLE:
            return () =>
                ({
                    type: CHROME_MESSAGE_TYPE,
                    action: CHROME_ACTION_NAME.TOGGLE,
                } as const)

        case CHROME_ACTION_NAME.CAPTURE:
            return (dataUri?: string) =>
                ({
                    type: CHROME_MESSAGE_TYPE,
                    action: CHROME_ACTION_NAME.CAPTURE,
                    payload: {
                        dataUri,
                    },
                } as const)

        case CHROME_ACTION_NAME.UNDEFINED:
            return () =>
                ({
                    type: CHROME_MESSAGE_TYPE,
                    action: CHROME_ACTION_NAME.UNDEFINED,
                } as const)
    }
}

export const parseChromeMessage = (message: any) => {
    if (!message?.type || message.type !== CHROME_MESSAGE_TYPE) {
        return {
            action: CHROME_ACTION_NAME.UNDEFINED,
        } as const
    }

    return message as
        | {
              action: CHROME_ACTION_NAME.TOGGLE
          }
        | {
              action: CHROME_ACTION_NAME.CAPTURE
              payload: {
                  dataUri?: string
              }
          }
}
