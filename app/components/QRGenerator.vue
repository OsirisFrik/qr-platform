<script setup lang="ts">
import { track } from '@vercel/analytics'
import { RotateCcw, Type, Wifi } from 'lucide-vue-next'
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
const mode = ref<'text' | 'wifi'>('text')
const wifiText = ref('')

const activeText = computed(() =>
  mode.value === 'wifi' ? wifiText.value : text.value
)

watch(mode, () => {
  reset()
  wifiText.value = ''
  showOptions.value = false
})

watch(wifiText, (val) => {
  if (mode.value === 'wifi') text.value = val
})

const handleDownload = async () => {
  const filename = `qr-code-${Date.now()}.png`
  await downloadQR(filename)
  if (qrDataUrl.value)
    addToHistory(activeText.value, qrDataUrl.value, options.value)
}

const handleCopy = async () => {
  await copyToClipboard()
  if (qrDataUrl.value)
    addToHistory(activeText.value, qrDataUrl.value, options.value)
}

const handleRestore = (item: QRHistoryItem) => {
  if (item.text.startsWith('WIFI:')) {
    mode.value = 'wifi'
    wifiText.value = item.text
    text.value = item.text
  } else {
    mode.value = 'text'
    text.value = item.text
  }
  options.value = { ...item.options }
}

const hasContent = computed(() =>
  mode.value === 'wifi' ? !!wifiText.value : !!text.value
)
</script>

<template>
  <div class="w-full max-w-2xl space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-foreground text-3xl font-bold">
        {{ $t('title') }}
      </h1>
      <p class="text-muted-foreground mt-2">
        {{ $t('subtitle') }}
      </p>
    </div>

    <!-- Main Content -->
    <FieldGroup class="gap-4">
      <!-- Mode Toggle -->
      <ButtonGroup class="w-full">
        <Button
          :variant="mode === 'text' ? 'default' : 'outline'"
          class="flex-1"
          @click="
            () => {
              mode = 'text'
              track('qr:mode:text')
            }
          "
        >
          <Type class="h-4 w-4" />
          {{ $t('mode.text') }}
        </Button>
        <ButtonGroupSeparator />
        <Button
          :variant="mode === 'wifi' ? 'default' : 'outline'"
          class="flex-1"
          @click="
            () => {
              mode = 'wifi'
              track('qr:mode:wifi')
            }
          "
        >
          <Wifi class="h-4 w-4" />
          {{ $t('mode.wifi') }}
        </Button>
      </ButtonGroup>

      <!-- Input by mode -->
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
        mode="out-in"
      >
        <QRInput v-if="mode === 'text'" v-model="text" />
        <QRWifiInput v-else v-model="wifiText" />
      </Transition>

      <QRPreview
        :data-url="qrDataUrl"
        :is-generating="isGenerating"
        @download="handleDownload"
        @copy="handleCopy"
      />

      <!-- Options Toggle (only for text mode) -->
      <Button
        v-if="mode === 'text'"
        variant="outline"
        class="w-full"
        @click="
          () => {
            showOptions = !showOptions
            track('qr:options:toggle')
          }
        "
      >
        {{ showOptions ? $t('options.hide') : $t('options.show') }}
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
        v-if="hasContent || qrDataUrl"
        variant="destructive"
        class="self-start"
        @click="
          () => {
            reset()
            wifiText = ''
            track('qr:reset')
          }
        "
      >
        <RotateCcw class="h-4 w-4" />
        {{ $t('reset') }}
      </Button>

      <!-- History -->
      <ClientOnly>
        <QRHistory @restore="handleRestore" />
      </ClientOnly>
    </FieldGroup>
  </div>
</template>
