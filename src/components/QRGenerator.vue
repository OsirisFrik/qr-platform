<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { track } from '@vercel/analytics'
import { Barcode, Link, MessageCircle, RotateCcw, Type, Wifi } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useQRCode } from '../composables/useQRCode'
import { useBarcode } from '../composables/useBarcode'
import { useQRHistory, type QRHistoryItem } from '../composables/useQRHistory'
import { useI18n } from '../i18n'

const {
  text,
  options,
  qrDataUrl,
  isGenerating: isGeneratingQR,
  downloadQR,
  copyToClipboard,
  reset
} = useQRCode()

const {
  text: barcodeText,
  options: barcodeOptions,
  barcodeDataUrl,
  isGenerating: isGeneratingBarcode,
  downloadBarcode,
  copyToClipboard: copyBarcodeToClipboard,
  reset: resetBarcode
} = useBarcode()

const { addToHistory } = useQRHistory()
const { t } = useI18n()

const showOptions = ref(false)
const showBarcodeOptions = ref(false)
const mode = ref<'text' | 'wifi' | 'whatsapp' | 'barcode'>('text')
const wifiText = ref('')
const whatsappText = ref('')

const activeDataUrl = computed(() =>
  mode.value === 'barcode' ? barcodeDataUrl.value : qrDataUrl.value
)
const activeIsGenerating = computed(() =>
  mode.value === 'barcode' ? isGeneratingBarcode.value : isGeneratingQR.value
)

const activeText = computed(() => {
  if (mode.value === 'wifi') return wifiText.value
  if (mode.value === 'whatsapp') return whatsappText.value
  if (mode.value === 'barcode') return barcodeText.value
  return text.value
})

watch(mode, () => {
  reset()
  resetBarcode()
  wifiText.value = ''
  whatsappText.value = ''
  showOptions.value = false
  showBarcodeOptions.value = false
})

watch(wifiText, (val) => {
  if (mode.value === 'wifi') text.value = val
})

watch(whatsappText, (val) => {
  if (mode.value === 'whatsapp') text.value = val
})

const handleDownload = async () => {
  if (mode.value === 'barcode') {
    const filename = `barcode-${Date.now()}.png`
    await downloadBarcode(filename)
    if (barcodeDataUrl.value)
      addToHistory(
        'barcode',
        activeText.value,
        barcodeDataUrl.value,
        barcodeOptions.value
      )
    return
  }
  const filename = `qr-code-${Date.now()}.png`
  await downloadQR(filename)
  if (qrDataUrl.value)
    addToHistory(mode.value, activeText.value, qrDataUrl.value, options.value)
}

const handleCopy = async () => {
  if (mode.value === 'barcode') {
    await copyBarcodeToClipboard()
    if (barcodeDataUrl.value)
      addToHistory(
        'barcode',
        activeText.value,
        barcodeDataUrl.value,
        barcodeOptions.value
      )
    return
  }
  await copyToClipboard()
  if (qrDataUrl.value)
    addToHistory(mode.value, activeText.value, qrDataUrl.value, options.value)
}

const inferLegacyType = (text: string): string => {
  if (text.startsWith('WIFI:')) return 'wifi'
  if (text.startsWith('https://wa.me/')) return 'whatsapp'
  return 'text'
}

const handleRestore = (item: QRHistoryItem) => {
  const type = item.type ?? inferLegacyType(item.text)
  mode.value = type as 'text' | 'wifi' | 'whatsapp' | 'barcode'

  if (type === 'wifi') {
    wifiText.value = item.text
    text.value = item.text
  } else if (type === 'whatsapp') {
    whatsappText.value = item.text
    text.value = item.text
  } else if (type === 'barcode') {
    barcodeText.value = item.text
      .replace(/[^A-Za-z0-9]/g, '')
      .slice(0, 20)
    if (item.options && 'fontSize' in item.options) {
      barcodeOptions.value = {
        fontSize: item.options.fontSize ?? 16
      }
    }
  } else {
    text.value = item.text
  }

  if (item.options && 'errorCorrection' in item.options) {
    options.value = { ...item.options } as typeof options.value
  }
}

const hasContent = computed(() => !!activeText.value)

const copyLink = async () => {
  await navigator.clipboard.writeText(whatsappText.value)
  toast.success(t('whatsapp.linkCopied'))
  track('qr:whatsapp:copy-link')
}

// Component imports
import Button from '@/components/ui/button/Button.vue'
import ButtonGroup from '@/components/ui/button-group/ButtonGroup.vue'
import ButtonGroupSeparator from '@/components/ui/button-group/ButtonGroupSeparator.vue'
import FieldGroup from '@/components/ui/field/FieldGroup.vue'
import QRInput from './QRInput.vue'
import QRWifiInput from './QRWifiInput.vue'
import QRWhatsAppInput from './QRWhatsAppInput.vue'
import QRBarcodeInput from './QRBarcodeInput.vue'
import QRPreview from './QRPreview.vue'
import QROptions from './QROptions.vue'
import BarcodeOptions from './BarcodeOptions.vue'
import QRHistory from './QRHistory.vue'
</script>

<template>
  <div class="w-full max-w-2xl space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-foreground text-3xl font-bold">
        {{ t('title') }}
      </h1>
      <p class="text-muted-foreground mt-2">
        {{ t('subtitle') }}
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
          {{ t('mode.text') }}
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
          {{ t('mode.wifi') }}
        </Button>
        <ButtonGroupSeparator />
        <Button
          :variant="mode === 'whatsapp' ? 'default' : 'outline'"
          class="flex-1"
          @click="
            () => {
              mode = 'whatsapp'
              track('qr:mode:whatsapp')
            }
          "
        >
          <MessageCircle class="h-4 w-4" />
          {{ t('mode.whatsapp') }}
        </Button>
        <ButtonGroupSeparator />
        <Button
          :variant="mode === 'barcode' ? 'default' : 'outline'"
          class="flex-1"
          @click="
            () => {
              mode = 'barcode'
              track('qr:mode:barcode')
            }
          "
        >
          <Barcode class="h-4 w-4" />
          {{ t('mode.barcode') }}
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
        <QRWifiInput v-else-if="mode === 'wifi'" v-model="wifiText" />
        <QRWhatsAppInput v-else-if="mode === 'whatsapp'" v-model="whatsappText" />
        <QRBarcodeInput v-else v-model="barcodeText" />
      </Transition>

      <QRPreview
        :data-url="activeDataUrl"
        :is-generating="activeIsGenerating"
        :alt-text="mode === 'barcode' ? t('preview.altBarcode') : t('preview.altQr')"
        @download="handleDownload"
        @copy="handleCopy"
      />

      <!-- Copy Link (only for whatsapp mode) -->
      <Button
        v-if="mode === 'whatsapp' && whatsappText"
        variant="outline"
        class="w-full"
        @click="copyLink"
      >
        <Link class="h-4 w-4" />
        {{ t('whatsapp.copyLink') }}
      </Button>

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
        {{ showOptions ? t('options.hide') : t('options.show') }}
      </Button>

      <!-- Barcode Options Toggle (only for barcode mode) -->
      <Button
        v-if="mode === 'barcode'"
        variant="outline"
        class="w-full"
        @click="
          () => {
            showBarcodeOptions = !showBarcodeOptions
            track('barcode:options:toggle')
          }
        "
      >
        {{ showBarcodeOptions ? t('barcodeOptions.hide') : t('barcodeOptions.show') }}
      </Button>

      <!-- QR Options Section -->
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

      <!-- Barcode Options Section -->
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <BarcodeOptions v-if="showBarcodeOptions" v-model="barcodeOptions" />
      </Transition>

      <!-- Reset Button -->
      <Button
        v-if="hasContent || qrDataUrl"
        variant="destructive"
        class="self-start"
        @click="
          () => {
            reset()
            resetBarcode()
            wifiText = ''
            whatsappText = ''
            track('qr:reset')
          }
        "
      >
        <RotateCcw class="h-4 w-4" />
        {{ t('reset') }}
      </Button>

      <!-- History -->
      <QRHistory @restore="handleRestore" />
    </FieldGroup>
  </div>
</template>
