export const pixel = <Input extends number | null | undefined>(
  input?: Input,
) => {
  let output: string | undefined

  if (typeof input === 'number') {
    output = `${input}px`
  }

  return output as Input extends number ? `${number}px` : undefined
}
