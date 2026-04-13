import { useLocalStorage } from '@vueuse/core'
import type { QROptions } from '~/composables/useQRCode'

export interface QRHistoryItem {
  id: string
  text: string
  qrDataUrl: string
  options: QROptions
  createdAt: number
}

const MAX_HISTORY = 20

export const useQRHistory = () => {
  const history = useLocalStorage<QRHistoryItem[]>('qr-history', [])

  const addToHistory = (text: string, qrDataUrl: string, options: QROptions) => {
    if (!text.trim() || !qrDataUrl) return

    const serializedOptions = JSON.stringify(options)
    const isDuplicate = history.value.some(
      item => item.text === text && JSON.stringify(item.options) === serializedOptions
    )
    if (isDuplicate) return

    const newItem: QRHistoryItem = {
      id: crypto.randomUUID(),
      text,
      qrDataUrl,
      options: { ...options },
      createdAt: Date.now()
    }

    history.value = [newItem, ...history.value].slice(0, MAX_HISTORY)
  }

  const removeFromHistory = (id: string) => {
    history.value = history.value.filter(item => item.id !== id)
  }

  const clearHistory = () => {
    history.value = []
  }

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory
  }
}
