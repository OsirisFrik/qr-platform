<script setup lang="ts">
import type { QROptions } from '~/composables/useQRCode'

interface Props {
  modelValue: QROptions
}

interface Emits {
  (e: 'update:modelValue', value: QROptions): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const update = (key: keyof QROptions, value: any) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })
}

const errorCorrectionLevels = [
  { value: 'L', label: 'Low (7%)' },
  { value: 'M', label: 'Medium (15%)' },
  { value: 'Q', label: 'Quartile (25%)' },
  { value: 'H', label: 'High (30%)' }
]
</script>

<template>
  <div class="w-full space-y-4 rounded-lg border border-input bg-card p-4">
    <h3 class="font-semibold text-foreground">
      {{ $t('qr.options.title') }}
    </h3>

    <!-- Size -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground">
        {{ $t('qr.options.size') }} ({{ modelValue.size }}px)
      </label>
      <input
        type="range"
        :value="modelValue.size"
        min="100"
        max="400"
        step="10"
        @input="update('size', parseInt($event.target.value))"
        class="w-full"
      />
    </div>

    <!-- Colors -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-foreground">
          {{ $t('qr.options.darkColor') }}
        </label>
        <div class="flex items-center gap-2">
          <input
            type="color"
            :value="modelValue.color"
            @input="update('color', $event.target.value)"
            class="h-10 w-12 cursor-pointer rounded border border-input"
          />
          <input
            type="text"
            :value="modelValue.color"
            @input="update('color', $event.target.value)"
            class="flex-1 rounded border border-input bg-background px-2 py-1 text-xs font-mono"
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-foreground">
          {{ $t('qr.options.lightColor') }}
        </label>
        <div class="flex items-center gap-2">
          <input
            type="color"
            :value="modelValue.backgroundColor"
            @input="update('backgroundColor', $event.target.value)"
            class="h-10 w-12 cursor-pointer rounded border border-input"
          />
          <input
            type="text"
            :value="modelValue.backgroundColor"
            @input="update('backgroundColor', $event.target.value)"
            class="flex-1 rounded border border-input bg-background px-2 py-1 text-xs font-mono"
          />
        </div>
      </div>
    </div>

    <!-- Error Correction -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground">
        {{ $t('qr.options.errorCorrection') }}
      </label>
      <select
        :value="modelValue.errorCorrection"
        @change="update('errorCorrection', $event.target.value)"
        class="w-full rounded border border-input bg-background px-3 py-2 text-sm"
      >
        <option
          v-for="level in errorCorrectionLevels"
          :key="level.value"
          :value="level.value"
        >
          {{ level.label }}
        </option>
      </select>
    </div>
  </div>
</template>
