<script setup lang="ts">
import { Trash2, RotateCcw, Clock, X } from 'lucide-vue-next'
import { useQRHistory, type QRHistoryItem } from '~/composables/useQRHistory'

const emit = defineEmits<{
  restore: [item: QRHistoryItem]
}>()

const { history, removeFromHistory, clearHistory } = useQRHistory()
const { t } = useI18n()

const formatDate = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (minutes < 1) return t('qr.history.justNow')
  if (minutes < 60) return t('qr.history.minutesAgo', { n: minutes })
  if (hours < 24) return t('qr.history.hoursAgo', { n: hours })
  return t('qr.history.daysAgo', { n: days })
}

const truncateText = (text: string, max = 40) =>
  text.length > max ? `${text.slice(0, max)}…` : text
</script>

<template>
  <div v-if="history.length > 0" class="space-y-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm font-medium text-foreground">
        <Clock class="h-4 w-4" />
        {{ $t('qr.history.title') }}
      </div>
      <Button
        variant="ghost"
        size="sm"
        class="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-destructive"
        @click="clearHistory"
      >
        <Trash2 class="h-3.5 w-3.5" />
        {{ $t('qr.history.clearAll') }}
      </Button>
    </div>

    <div class="grid gap-2">
      <div
        v-for="item in history"
        :key="item.id"
        class="bg-card border-border flex items-center gap-3 rounded-lg border p-2 transition-colors"
      >
        <!-- QR Thumbnail -->
        <img
          :src="item.qrDataUrl"
          :alt="truncateText(item.text)"
          class="h-12 w-12 shrink-0 rounded object-contain"
        />

        <!-- Info -->
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-foreground">
            {{ truncateText(item.text) }}
          </p>
          <p class="mt-0.5 text-xs text-muted-foreground">
            {{ formatDate(item.createdAt) }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            class="h-7 w-7 text-muted-foreground hover:text-foreground"
            :title="$t('qr.history.restore')"
            @click="emit('restore', item)"
          >
            <RotateCcw class="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="h-7 w-7 text-muted-foreground hover:text-destructive"
            :title="$t('qr.history.remove')"
            @click="removeFromHistory(item.id)"
          >
            <X class="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
