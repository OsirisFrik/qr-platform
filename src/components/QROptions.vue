<script setup lang="ts">
import { computed, ref } from 'vue'
import { track } from '@vercel/analytics'
import { useVModel } from '@vueuse/core'
import { ImagePlus, X } from 'lucide-vue-next'
import type { QROptions } from '../composables/useQRCode'
import { useI18n } from '../i18n'

const { t } = useI18n()

// Component imports
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import FieldGroup from '@/components/ui/field/FieldGroup.vue'
import Field from '@/components/ui/field/Field.vue'
import FieldLabel from '@/components/ui/field/FieldLabel.vue'
import FieldDescription from '@/components/ui/field/FieldDescription.vue'
import FieldContent from '@/components/ui/field/FieldContent.vue'
import Input from '@/components/ui/input/Input.vue'
import NativeSelect from '@/components/ui/native-select/NativeSelect.vue'
import NativeSelectOption from '@/components/ui/native-select/NativeSelectOption.vue'
import Slider from '@/components/ui/slider/Slider.vue'
import Button from '@/components/ui/button/Button.vue'

const props = defineProps<{
  modelValue: QROptions
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: QROptions): void
}>()

const model = useVModel(props, 'modelValue', emit, { passive: true })

const sizeModel = computed({
  get: () => [model.value.size],
  set: ([val = model.value.size]: number[]) => {
    model.value = { ...model.value, size: val }
  }
})

const colorModel = computed({
  get: () => model.value.color,
  set: (val: string) => {
    model.value = { ...model.value, color: val }
  }
})

const bgColorModel = computed({
  get: () => model.value.backgroundColor,
  set: (val: string) => {
    model.value = { ...model.value, backgroundColor: val }
  }
})

const errorCorrectionModel = computed({
  get: () => model.value.errorCorrection,
  set: (val: string) => {
    model.value = {
      ...model.value,
      errorCorrection: val as QROptions['errorCorrection']
    }
  }
})

const logoModel = computed({
  get: () => model.value.logo,
  set: (val: string | null) => {
    model.value = { ...model.value, logo: val }
  }
})

const fileInput = ref<HTMLInputElement | null>(null)

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    logoModel.value = ev.target?.result as string
  }
  reader.readAsDataURL(file)
}

const errorCorrectionLevels = [
  { value: 'L', label: 'Low (7%)' },
  { value: 'M', label: 'Medium (15%)' },
  { value: 'Q', label: 'Quartile (25%)' },
  { value: 'H', label: 'High (30%)' }
]
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ t('options.title') }}</CardTitle>
    </CardHeader>
    <CardContent>
      <FieldGroup class="gap-4">
        <!-- Size -->
        <Field>
          <FieldLabel>{{ t('options.size') }} ({{ model.size }}px)</FieldLabel>
          <Slider v-model="sizeModel" :min="100" :max="400" :step="10" />
        </Field>

        <!-- Colors -->
        <div class="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>{{ t('options.darkColor') }}</FieldLabel>
            <div class="flex items-center gap-2">
              <input
                v-model="colorModel"
                type="color"
                class="border-input h-9 w-10 cursor-pointer rounded border p-0.5"
              />
              <Input
                v-model="colorModel"
                type="text"
                class="font-mono text-xs"
              />
            </div>
          </Field>

          <Field>
            <FieldLabel>{{ t('options.lightColor') }}</FieldLabel>
            <div class="flex items-center gap-2">
              <input
                v-model="bgColorModel"
                type="color"
                class="border-input h-9 w-10 cursor-pointer rounded border p-0.5"
              />
              <Input
                v-model="bgColorModel"
                type="text"
                class="font-mono text-xs"
              />
            </div>
          </Field>
        </div>

        <!-- Error Correction -->
        <Field>
          <FieldLabel>{{ t('options.errorCorrection') }}</FieldLabel>
          <NativeSelect v-model="errorCorrectionModel" class="w-full">
            <NativeSelectOption
              v-for="level in errorCorrectionLevels"
              :key="level.value"
              :value="level.value"
            >
              {{ level.label }}
            </NativeSelectOption>
          </NativeSelect>
        </Field>

        <!-- Logo -->
        <Field>
          <FieldLabel>{{ t('options.logo') }}</FieldLabel>
          <div v-if="logoModel" class="flex items-center gap-3">
            <div
              class="border-input bg-muted flex h-14 w-14 items-center justify-center rounded-md border p-1.5"
            >
              <img
                :src="logoModel"
                alt="Logo"
                class="max-h-full max-w-full object-contain"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              @click="
                () => {
                  logoModel = null
                  track('qr:options:removeLogo')
                }
              "
            >
              <X class="h-4 w-4" />
              {{ t('options.removeLogo') }}
            </Button>
          </div>
          <template v-else>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onFileChange"
            />
            <Button
              variant="outline"
              size="sm"
              @click="
                () => {
                  fileInput?.click()
                  track('qr:options:addLogo')
                }
              "
            >
              <ImagePlus class="h-4 w-4" />
              {{ t('options.addLogo') }}
            </Button>
          </template>
          <FieldDescription>{{ t('options.logoHint') }}</FieldDescription>
        </Field>
      </FieldGroup>
    </CardContent>
  </Card>
</template>
