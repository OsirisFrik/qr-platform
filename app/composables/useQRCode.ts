import QRCode from 'qrcode'

export interface QROptions {
  size: number
  color: string
  backgroundColor: string
  errorCorrection: 'L' | 'M' | 'Q' | 'H'
}

const defaultOptions: QROptions = {
  size: 200,
  color: '#000000',
  backgroundColor: '#FFFFFF',
  errorCorrection: 'M'
}

export const useQRCode = () => {
  const text = ref('')
  const options = ref<QROptions>({ ...defaultOptions })
  const qrDataUrl = ref<string | null>(null)
  const isGenerating = ref(false)

  const generateQR = async (content: string) => {
    if (!content.trim()) {
      qrDataUrl.value = null
      return
    }

    try {
      isGenerating.value = true
      qrDataUrl.value = await QRCode.toDataURL(content, {
        width: options.value.size,
        color: {
          dark: options.value.color,
          light: options.value.backgroundColor
        },
        errorCorrectionLevel: options.value.errorCorrection,
        margin: 1
      })
    } catch (error) {
      console.error('Error generating QR code:', error)
      qrDataUrl.value = null
    } finally {
      isGenerating.value = false
    }
  }

  const downloadQR = async (filename = 'qr-code.png') => {
    if (!qrDataUrl.value) return

    try {
      const link = document.createElement('a')
      link.href = qrDataUrl.value
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading QR code:', error)
    }
  }

  const copyToClipboard = async () => {
    if (!qrDataUrl.value) return

    try {
      const response = await fetch(qrDataUrl.value)
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
    options.value = { ...defaultOptions }
    qrDataUrl.value = null
  }

  watch(
    text,
    (newText) => {
      generateQR(newText)
    },
    { debounce: 300 }
  )

  watch(options, () => {
    if (text.value) {
      generateQR(text.value)
    }
  }, { deep: true, debounce: 300 })

  return {
    text,
    options,
    qrDataUrl,
    isGenerating,
    generateQR,
    downloadQR,
    copyToClipboard,
    reset
  }
}
