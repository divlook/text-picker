import TextPicker from '@/components/TextPicker'
import { enableChromeTab } from '@text-picker/core/chrome/tab'
import { useEffect, useState } from 'react'

function ChromeApp() {
  const [displayed, setDisplayed] = useState(false)

  useEffect(() => {
    const chromeTabHandler = enableChromeTab({
      onMessage: (action) => {
        switch (action) {
          case 'toggle':
            setDisplayed((prev) => !prev)
            break
        }
      },
    })

    return () => {
      chromeTabHandler.disable()
    }
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
