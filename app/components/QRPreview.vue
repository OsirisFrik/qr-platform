<script setup lang="ts">
import { track } from '@vercel/analytics'
import { Download, Copy, Check } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    dataUrl: string | null
    isGenerating?: boolean
  }>(),
  {
    isGenerating: false
  }
)

const emit = defineEmits<{
  (e: 'download'): void
  (e: 'copy'): void
}>()

const isCopied = ref(false)

const handleCopy = () => {
  emit('copy')
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}
</script>

<template>
  <Card class="items-center justify-center border-2 border-dashed shadow-none">
    <CardContent class="flex flex-col items-center gap-4 py-8">
      <!-- Empty State -->
      <p v-if="!dataUrl && !isGenerating" class="text-muted-foreground text-sm">
        {{ $t('preview.empty') }}
      </p>

      <!-- Loading State -->
      <template v-else-if="isGenerating">
        <div
          class="border-muted border-t-primary h-12 w-12 animate-spin rounded-full border-4"
        />
        <p class="text-muted-foreground text-sm">
          {{ $t('preview.generating') }}
        </p>
      </template>

      <!-- QR Code Display -->
      <template v-else>
        <div class="rounded-lg bg-white p-4 shadow-sm">
          <img
            :src="dataUrl!"
            alt="QR Code"
            class="h-auto max-h-80 w-auto max-w-80"
          />
        </div>

        <div class="flex gap-2">
          <Button
            @click="
              () => {
                track('qr:download')
                emit('download')
              }
            "
          >
            <Download class="h-4 w-4" />
            {{ $t('preview.download') }}
          </Button>
          <Button
            variant="outline"
            @click="
              () => {
                track('qr:copy')
                handleCopy()
              }
            "
          >
            <Check v-if="isCopied" class="h-4 w-4 text-green-600" />
            <Copy v-else class="h-4 w-4" />
            {{ isCopied ? $t('preview.copied') : $t('preview.copy') }}
          </Button>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
