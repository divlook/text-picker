import Tesseract from 'tesseract.js'
import { copyText } from '~/libs/utils'

export const textRecognize = async (dataUri: string) => {
    const { data } = await Tesseract.recognize(dataUri)

    console.log(data.blocks)
    console.log(data.blocks?.[0].baseline)
    console.log(data.blocks?.[0].bbox)
    console.log(data.blocks?.[0].text)

    // copyText('copied')
}

export const capture = () => {
    /*
    return new Promise<Blob | string | void>((resolve) => {
        chrome.runtime.sendMessage(
            makeChromeMessage(CHROME_ACTION_NAME.CAPTURE)(),
        )

        this.on('capture', (dataUri?: string) => {
            this.guideBox.toolbar.setActive(true)
            this.off('capture')

            if (!dataUri) {
                resolve()
                return
            }

            const img = new Image()
            img.src = dataUri
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const { outline } = this.guideBox
                const ratio = window.devicePixelRatio

                canvas.width = outline.width
                canvas.height = outline.height

                const ctx = canvas.getContext('2d')

                if (ctx) {
                    const left = outline.x
                    const top = outline.y - window.scrollY

                    ctx.drawImage(
                        img,
                        left * ratio,
                        top * ratio,
                        outline.width * ratio,
                        outline.height * ratio,
                        0,
                        0,
                        outline.width,
                        outline.height,
                    )

                    resolve(canvas.toDataURL())
                }
            }
        })
    })
    */
}
