import TextPicker from '@/components/TextPicker'
import { ChromeSDK } from '@text-picker/core/chrome/sdk'
import { useEffect, useState } from 'react'

function ChromeApp() {
  const [displayed, setDisplayed] = useState(false)

  useEffect(() => {
    ChromeSDK.initContent({
      onMessage: (action) => {
        switch (action) {
          case 'toggle':
            setDisplayed((prev) => !prev)
            break
        }
      },
    })
  }, [])

  return (
    <TextPicker
      displayed={displayed}
      onQuit={() => {
        setDisplayed(false)
      }}
    />
  )
}

export default ChromeApp
