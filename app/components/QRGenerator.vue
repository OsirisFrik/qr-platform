<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next'
import { useQRCode } from '~/composables/useQRCode'

const {
  text,
  options,
  qrDataUrl,
  isGenerating,
  downloadQR,
  copyToClipboard,
  reset
} = useQRCode()

const showOptions = ref(false)

const handleDownload = async () => {
  const filename = `qr-code-${Date.now()}.png`
  await downloadQR(filename)
}

const handleCopy = async () => {
  await copyToClipboard()
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
    <div class="space-y-4">
      <!-- Input Section -->
      <QRInput v-model="text" />

      <!-- Preview Section -->
      <QRPreview
        :data-url="qrDataUrl"
        :is-generating="isGenerating"
        @download="handleDownload"
        @copy="handleCopy"
      />

      <!-- Options Toggle -->
      <button
        @click="showOptions = !showOptions"
        class="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
      >
        {{
          showOptions
            ? $t('qr.options.hide')
            : $t('qr.options.show')
        }}
      </button>

      <!-- Options Section -->
      <transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-show="showOptions">
          <QROptions v-model="options" />
        </div>
      </transition>

      <!-- Reset Button -->
      <button
        v-if="text || qrDataUrl"
        @click="reset"
        class="inline-flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/20"
      >
        <RotateCcw class="h-4 w-4" />
        {{ $t('qr.reset') }}
      </button>
    </div>
  </div>
</template>
