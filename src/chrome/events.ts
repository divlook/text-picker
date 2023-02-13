import { CHROME_APP_ID } from '~/chrome/constants'
import { ActionType, ChromeAction } from '~/chrome/types'

const actionTypeSet = new Set(Object.values(ActionType))

export const makeChromeMessage = (action: ChromeAction) => {
    if (actionTypeSet.has(action.type)) {
        return {
            appId: CHROME_APP_ID,
            ...action,
        }
    }

    return null
}

export const parseChromeMessage = (message: any) => {
    if (message?.appId === CHROME_APP_ID) {
        return message as ChromeAction
    }

    return null
}
