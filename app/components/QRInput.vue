<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Enter URL or text...',
  disabled: false
})

defineEmits<Emits>()
</script>

<template>
  <div class="w-full space-y-2">
    <label class="block text-sm font-medium text-foreground">
      {{ $t('qr.input.label') }}
    </label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      class="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
    />
    <p class="text-xs text-muted-foreground">
      {{ $t('qr.input.hint') }}
    </p>
  </div>
</template>
