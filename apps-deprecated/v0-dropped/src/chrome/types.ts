export enum ActionType {
    Toggle = 'TOGGLE',
    Capture = 'CAPTURE',
    CaptureResult = 'CAPTURE_RESULT',
}

export type ChromeAction =
    | {
          type: ActionType.Toggle
      }
    | {
          type: ActionType.Capture
      }
    | {
          type: ActionType.CaptureResult
          dataUri?: string
      }
