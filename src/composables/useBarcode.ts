import { watchDebounced } from '@vueuse/core'
import JsBarcode from 'jsbarcode'
import { ref } from 'vue'

export interface BarcodeOptions {
  fontSize: number
}

const defaultBarcodeOptions: BarcodeOptions = {
  fontSize: 16
}

const renderBarcodeToCanvas = (
  text: string,
  opts: BarcodeOptions
): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      JsBarcode(canvas, text, {
        format: 'CODE128',
        width: 2,
        height: 100,
        margin: 10,
        displayValue: true,
        background: '#FFFFFF',
        lineColor: '#000000',
        fontSize: opts.fontSize
      })
      resolve(canvas.toDataURL('image/png'))
    } catch (error) {
      reject(error)
    }
  })

export const useBarcode = () => {
  const text = ref('')
  const options = ref<BarcodeOptions>({ ...defaultBarcodeOptions })
  const barcodeDataUrl = ref<string | null>(null)
  const isGenerating = ref(false)

  const generateBarcode = async (content: string) => {
    if (!content.trim()) {
      barcodeDataUrl.value = null
      return
    }
    try {
      isGenerating.value = true
      barcodeDataUrl.value = await renderBarcodeToCanvas(content, options.value)
    } catch (error) {
      console.error('Error generating barcode:', error)
      barcodeDataUrl.value = null
    } finally {
      isGenerating.value = false
    }
  }

  const downloadBarcode = async (filename = 'barcode.png') => {
    if (!barcodeDataUrl.value) return
    try {
      const link = document.createElement('a')
      link.href = barcodeDataUrl.value
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading barcode:', error)
    }
  }

  const copyToClipboard = async () => {
    if (!barcodeDataUrl.value) return
    try {
      const response = await fetch(barcodeDataUrl.value)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const reset = () => {
    text.value = ''
    options.value = { ...defaultBarcodeOptions }
    barcodeDataUrl.value = null
  }

  watchDebounced(text, (newText: string) => generateBarcode(newText), {
    debounce: 300
  })

  watchDebounced(
    options,
    () => {
      if (text.value) generateBarcode(text.value)
    },
    { deep: true, debounce: 300 }
  )

  return {
    text,
    options,
    barcodeDataUrl,
    isGenerating,
    downloadBarcode,
    copyToClipboard,
    reset
  }
}
