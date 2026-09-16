<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from '../i18n'
import type { BarcodeOptions } from '../composables/useBarcode'

import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Field from '@/components/ui/field/Field.vue'
import FieldLabel from '@/components/ui/field/FieldLabel.vue'
import Slider from '@/components/ui/slider/Slider.vue'

const { t } = useI18n()

const props = defineProps<{
  modelValue: BarcodeOptions
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: BarcodeOptions): void
}>()

const handleFontSizeChange = (value: number[]) => {
  emit('update:modelValue', {
    ...props.modelValue,
    fontSize: value[0]
  })
}
</script>

<template>
  <Card>
    <CardContent class="space-y-6 py-6">
      <h3 class="text-lg font-semibold">{{ t('barcodeOptions.title') }}</h3>

      <Field>
        <FieldLabel>{{ t('barcodeOptions.fontSize') }}</FieldLabel>
        <div class="flex items-center gap-4">
          <Slider
            :model-value="[modelValue.fontSize]"
            :min="8"
            :max="32"
            :step="1"
            class="flex-1"
            @update:model-value="handleFontSizeChange"
          />
          <span class="text-muted-foreground w-12 text-right text-sm font-mono">
            {{ modelValue.fontSize }}px
          </span>
        </div>
      </Field>
    </CardContent>
  </Card>
</template>
