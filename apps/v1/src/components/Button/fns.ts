import type { ButtonSchema } from '@/components/Button/schema'

export namespace ButtonFns {
  export function getLabelJSX(label: ButtonSchema.Label) {
    if (typeof label === 'function') {
      return label()
    }

    return label
  }
}
