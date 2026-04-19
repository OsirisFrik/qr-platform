import { watchDebounced } from '@vueuse/core'
import QRCode from 'qrcode'
import { ref } from 'vue'

export interface QROptions {
  size: number
  color: string
  backgroundColor: string
  errorCorrection: 'L' | 'M' | 'Q' | 'H'
  logo: string | null
  dotStyle: 'square' | 'dot' | 'rounded'
}

const defaultOptions: QROptions = {
  size: 200,
  color: '#000000',
  backgroundColor: '#FFFFFF',
  errorCorrection: 'M',
  logo: null,
  dotStyle: 'square'
}

const renderQRToCanvas = (
  text: string,
  opts: QROptions
): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      const qr = QRCode.create(text, {
        errorCorrectionLevel: opts.errorCorrection
      })
      const modules = qr.modules
      const matrixSize = modules.size
      const margin = 2
      const moduleSize = Math.floor(opts.size / (matrixSize + margin * 2))
      const totalSize = (matrixSize + margin * 2) * moduleSize

      const canvas = document.createElement('canvas')
      canvas.width = totalSize
      canvas.height = totalSize
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas not available'))

      ctx.fillStyle = opts.backgroundColor
      ctx.fillRect(0, 0, totalSize, totalSize)

      ctx.fillStyle = opts.color

      for (let row = 0; row < matrixSize; row++) {
        for (let col = 0; col < matrixSize; col++) {
          const idx = row * matrixSize + col
          if (!modules.data[idx]) continue

          const x = (col + margin) * moduleSize
          const y = (row + margin) * moduleSize

          if (opts.dotStyle === 'dot') {
            ctx.beginPath()
            ctx.arc(
              x + moduleSize / 2,
              y + moduleSize / 2,
              moduleSize * 0.45,
              0,
              Math.PI * 2
            )
            ctx.fill()
          } else if (opts.dotStyle === 'rounded') {
            const r = moduleSize * 0.35
            ctx.beginPath()
            ctx.roundRect(x, y, moduleSize, moduleSize, r)
            ctx.fill()
          } else {
            ctx.fillRect(x, y, moduleSize, moduleSize)
          }
        }
      }

      resolve(canvas.toDataURL('image/png'))
    } catch (error) {
      reject(error)
    }
  })

const compositeLogoOnQR = (
  qrSrc: string,
  logoSrc: string,
  size: number
): Promise<string> =>
  new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return reject(new Error('Canvas not available'))

    const qrImg = new Image()
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 0, 0, size, size)

      const logoImg = new Image()
      logoImg.onload = () => {
        const logoSize = size * 0.22
        const x = (size - logoSize) / 2
        const y = (size - logoSize) / 2
        const padding = logoSize * 0.15
        const bg = logoSize + padding * 2

        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.roundRect(x - padding, y - padding, bg, bg, bg * 0.15)
        ctx.fill()

        ctx.drawImage(logoImg, x, y, logoSize, logoSize)
        resolve(canvas.toDataURL('image/png'))
      }
      logoImg.onerror = reject
      logoImg.src = logoSrc
    }
    qrImg.onerror = reject
    qrImg.src = qrSrc
  })

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
      const hasLogo = !!options.value.logo
      const errorCorrectionLevel = hasLogo ? 'H' : options.value.errorCorrection
      const baseDataUrl = await renderQRToCanvas(content, {
        ...options.value,
        errorCorrection: errorCorrectionLevel
      })

      if (typeof window !== 'undefined' && hasLogo && options.value.logo) {
        qrDataUrl.value = await compositeLogoOnQR(
          baseDataUrl,
          options.value.logo,
          options.value.size
        )
      } else {
        qrDataUrl.value = baseDataUrl
      }
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

  watchDebounced(text, (newText: string) => generateQR(newText), {
    debounce: 300
  })

  watchDebounced(
    options,
    () => {
      if (text.value) generateQR(text.value)
    },
    { deep: true, debounce: 300 }
  )

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
