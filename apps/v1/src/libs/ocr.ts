import Tesseract from 'tesseract.js'

export const textRecognize = async (dataUri: string) => {
    const { data } = await Tesseract.recognize(dataUri, 'eng+kor')

    return data
}
