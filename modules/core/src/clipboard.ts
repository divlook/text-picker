export type CopyTextResult = {
  code:
    | 'NO_TEXT_SELECTED'
    | 'SUCCESS'
    | 'PERMISSION_DENIED'
    | 'NOT_SUPPORTED'
    | 'DOM_EXCEPTION'
    | 'HTTPS_REQUIRED'
    | 'UNKNOWN_ERROR'
  message: string
}

function writeClipboardText(text: string) {
  return navigator.clipboard.writeText(text)
}

export async function copyText(
  text: string,
  writeText = writeClipboardText,
): Promise<CopyTextResult> {
  if (!text) return { code: 'NO_TEXT_SELECTED', message: 'No text selected' }
  if (
    window.location.protocol !== 'https:' &&
    window.location.hostname !== 'localhost'
  ) {
    return {
      code: 'HTTPS_REQUIRED',
      message: 'Failed to copy text: Clipboard API requires HTTPS',
    }
  }
  try {
    await writeText(text)
    return { code: 'SUCCESS', message: 'Text copied successfully' }
  } catch (error) {
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'NotAllowedError':
          return {
            code: 'PERMISSION_DENIED',
            message: 'Failed to copy text: Permission denied',
          }
        case 'NotSupportedError':
          return {
            code: 'NOT_SUPPORTED',
            message: 'Failed to copy text: Clipboard API not supported',
          }
        default:
          return {
            code: 'DOM_EXCEPTION',
            message: `Failed to copy text: ${error.message}`,
          }
      }
    }
    return { code: 'UNKNOWN_ERROR', message: `Failed to copy text: ${error}` }
  }
}
