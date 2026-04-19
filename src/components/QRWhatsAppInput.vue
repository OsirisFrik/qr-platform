<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { MessageCircle, Phone } from 'lucide-vue-next'
import { useI18n } from '../i18n'

// Component imports
import FieldGroup from '@/components/ui/field/FieldGroup.vue'
import Field from '@/components/ui/field/Field.vue'
import FieldLabel from '@/components/ui/field/FieldLabel.vue'
import FieldDescription from '@/components/ui/field/FieldDescription.vue'
import Input from '@/components/ui/input/Input.vue'
import Textarea from '@/components/ui/textarea/Textarea.vue'

const { t } = useI18n()

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const phone = ref('')
const message = ref('')

const whatsappLink = computed(() => {
  const cleaned = phone.value.replace(/\D/g, '')
  if (!cleaned) return ''
  const encoded = encodeURIComponent(message.value)
  return `https://wa.me/${cleaned}${encoded ? `?text=${encoded}` : ''}`
})

watch(whatsappLink, (val) => emit('update:modelValue', val), {
  immediate: true
})
</script>

<template>
  <FieldGroup class="gap-4">
    <!-- Phone -->
    <Field>
      <FieldLabel>{{ t('whatsapp.phone') }}</FieldLabel>
      <div class="relative">
        <Phone
          class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
        />
        <Input
          v-model="phone"
          type="tel"
          class="pl-9"
          :placeholder="t('whatsapp.phonePlaceholder')"
          autocomplete="off"
        />
      </div>
      <FieldDescription>{{ t('whatsapp.phoneHint') }}</FieldDescription>
    </Field>

    <!-- Message -->
    <Field>
      <FieldLabel>{{ t('whatsapp.message') }}</FieldLabel>
      <div class="relative">
        <MessageCircle
          class="text-muted-foreground absolute top-3 left-3 h-4 w-4"
        />
        <Textarea
          v-model="message"
          class="min-h-[80px] pl-9"
          :placeholder="t('whatsapp.messagePlaceholder')"
        />
      </div>
      <FieldDescription>{{ t('whatsapp.messageHint') }}</FieldDescription>
    </Field>
  </FieldGroup>
</template>
