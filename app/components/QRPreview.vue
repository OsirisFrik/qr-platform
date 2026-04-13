<script setup lang="ts">
import { Download, Copy, Check } from 'lucide-vue-next'

interface Props {
  dataUrl: string | null
  isGenerating?: boolean
}

interface Emits {
  (e: 'download'): void
  (e: 'copy'): void
}

withDefaults(defineProps<Props>(), {
  isGenerating: false
})

defineEmits<Emits>()

const isCopied = ref(false)

const handleCopy = (emit: any) => {
  emit('copy')
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-8">
    <!-- Empty State -->
    <div v-if="!dataUrl && !isGenerating" class="text-center">
      <p class="text-sm text-muted-foreground">
        {{ $t('qr.preview.empty') }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-else-if="isGenerating" class="flex flex-col items-center gap-2">
      <div
        class="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"
      />
      <p class="text-sm text-muted-foreground">
        {{ $t('qr.preview.generating') }}
      </p>
    </div>

    <!-- QR Code Display -->
    <div v-else class="flex flex-col items-center gap-4">
      <div class="rounded-lg bg-white p-4 shadow-sm">
        <img
          :src="dataUrl"
          alt="QR Code"
          class="h-auto max-h-80 w-auto max-w-80"
        />
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          @click="$emit('download')"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <Download class="h-4 w-4" />
          {{ $t('qr.preview.download') }}
        </button>
        <button
          @click="handleCopy($emit)"
          class="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          <Copy v-if="!isCopied" class="h-4 w-4" />
          <Check v-else class="h-4 w-4 text-green-600" />
          {{
            isCopied
              ? $t('qr.preview.copied')
              : $t('qr.preview.copy')
          }}
        </button>
      </div>
    </div>
  </div>
</template>
