<script setup lang="ts">
import { ref, watch } from 'vue'
import { Barcode } from 'lucide-vue-next'
import { useI18n } from '../i18n'

import Field from '@/components/ui/field/Field.vue'
import FieldLabel from '@/components/ui/field/FieldLabel.vue'
import FieldDescription from '@/components/ui/field/FieldDescription.vue'
import Input from '@/components/ui/input/Input.vue'

const { t } = useI18n()
const MAX_LENGTH = 20

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const value = ref('')

watch(value, (raw) => {
  const sanitized = raw.replace(/[^A-Za-z0-9]/g, '').slice(0, MAX_LENGTH)
  if (sanitized !== raw) value.value = sanitized
  emit('update:modelValue', sanitized)
})
</script>

<template>
  <Field>
    <FieldLabel>{{ t('barcode.label') }}</FieldLabel>
    <div class="relative">
      <Barcode
        class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
      />
      <Input
        v-model="value"
        type="text"
        class="pl-9 font-mono"
        :placeholder="t('barcode.placeholder')"
        :maxlength="MAX_LENGTH"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
      />
    </div>
    <FieldDescription>{{ t('barcode.hint') }}</FieldDescription>
    <FieldDescription class="text-xs tabular-nums">
      {{ value.length }}/{{ MAX_LENGTH }}
    </FieldDescription>
  </Field>
</template>
