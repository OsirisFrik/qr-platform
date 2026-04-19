<script setup lang="ts">
import { useI18n } from '../i18n'

// Component imports
import Field from '@/components/ui/field/Field.vue'
import FieldLabel from '@/components/ui/field/FieldLabel.vue'
import FieldDescription from '@/components/ui/field/FieldDescription.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    placeholder: 'Enter URL or text...',
    disabled: false
  }
)

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <Field>
    <FieldLabel>{{ t('input.label') }}</FieldLabel>
    <Textarea
      :model-value="props.modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="min-h-24 resize-none"
      @update:model-value="emits('update:modelValue', String($event))"
    />
    <FieldDescription>{{ t('input.hint') }}</FieldDescription>
  </Field>
</template>
