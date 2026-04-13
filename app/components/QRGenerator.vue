<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next'
import { useQRCode } from '~/composables/useQRCode'
import { useQRHistory, type QRHistoryItem } from '~/composables/useQRHistory'

const {
  text,
  options,
  qrDataUrl,
  isGenerating,
  downloadQR,
  copyToClipboard,
  reset
} = useQRCode()

const { addToHistory } = useQRHistory()

const showOptions = ref(false)

const handleDownload = async () => {
  const filename = `qr-code-${Date.now()}.png`
  await downloadQR(filename)
  if (qrDataUrl.value) addToHistory(text.value, qrDataUrl.value, options.value)
}

const handleCopy = async () => {
  await copyToClipboard()
  if (qrDataUrl.value) addToHistory(text.value, qrDataUrl.value, options.value)
}

const handleRestore = (item: QRHistoryItem) => {
  text.value = item.text
  options.value = { ...item.options }
}
</script>

<template>
  <div class="w-full max-w-2xl space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-foreground">
        {{ $t('qr.title') }}
      </h1>
      <p class="mt-2 text-muted-foreground">
        {{ $t('qr.subtitle') }}
      </p>
    </div>

    <!-- Main Content -->
    <FieldGroup class="gap-4">
      <QRInput v-model="text" />

      <QRPreview
        :data-url="qrDataUrl"
        :is-generating="isGenerating"
        @download="handleDownload"
        @copy="handleCopy"
      />

      <!-- Options Toggle -->
      <Button variant="outline" class="w-full" @click="showOptions = !showOptions">
        {{ showOptions ? $t('qr.options.hide') : $t('qr.options.show') }}
      </Button>

      <!-- Options Section -->
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <QROptions v-if="showOptions" v-model="options" />
      </Transition>

      <!-- Reset Button -->
      <Button
        v-if="text || qrDataUrl"
        variant="destructive"
        class="self-start"
        @click="reset"
      >
        <RotateCcw class="h-4 w-4" />
        {{ $t('qr.reset') }}
      </Button>

      <!-- History -->
      <QRHistory @restore="handleRestore" />
    </FieldGroup>
  </div>
</template>
