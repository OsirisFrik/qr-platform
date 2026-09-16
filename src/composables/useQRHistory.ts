import { useLocalStorage } from '@vueuse/core'
import type { QROptions } from '~/composables/useQRCode'

export type QRHistoryType = 'text' | 'wifi' | 'whatsapp' | 'barcode'

export interface QRHistoryItem {
  id: string
  text: string
  qrDataUrl: string
  options: Record<string, any> | null
  type?: QRHistoryType
  createdAt: number
}

const MAX_HISTORY = 20

export const useQRHistory = () => {
  const history = useLocalStorage<QRHistoryItem[]>('qr-history', [])

  const addToHistory = (
    type: QRHistoryType,
    text: string,
    qrDataUrl: string,
    options: Record<string, any> | null
  ) => {
    if (!text.trim() || !qrDataUrl) return

    const serializedOptions = JSON.stringify(options)
    const isDuplicate = history.value.some(
      (item) =>
        (item.type ?? 'text') === type &&
        item.text === text &&
        JSON.stringify(item.options) === serializedOptions
    )
    if (isDuplicate) return

    const newItem: QRHistoryItem = {
      id: crypto.randomUUID(),
      type,
      text,
      qrDataUrl,
      options: options ? { ...options } : null,
      createdAt: Date.now()
    }

    history.value = [newItem, ...history.value].slice(0, MAX_HISTORY)
  }

  const removeFromHistory = (id: string) => {
    history.value = history.value.filter((item) => item.id !== id)
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
