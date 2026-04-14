<script setup lang="ts">
import { Eye, EyeOff, Wifi } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const ssid = ref('')
const password = ref('')
const security = ref<'WPA' | 'WEP' | 'nopass'>('WPA')
const hidden = ref(false)
const showPassword = ref(false)

const securityOptions = [
  { value: 'WPA', label: 'WPA/WPA2' },
  { value: 'WEP', label: 'WEP' },
  { value: 'nopass', label: 'None' }
]

const wifiString = computed(() => {
  if (!ssid.value.trim()) return ''
  const s = ssid.value.replace(/([\\;,":])/, '\\$1')
  const p = password.value.replace(/([\\;,":])/, '\\$1')
  const t = security.value
  const h = hidden.value ? 'true' : 'false'
  if (t === 'nopass') return `WIFI:T:nopass;S:${s};H:${h};;`
  return `WIFI:T:${t};S:${s};P:${p};H:${h};;`
})

watch(wifiString, (val) => emit('update:modelValue', val), { immediate: true })
</script>

<template>
  <FieldGroup class="gap-4">
    <!-- SSID -->
    <Field>
      <FieldLabel>{{ $t('wifi.ssid') }}</FieldLabel>
      <div class="relative">
        <Wifi
          class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
        />
        <Input
          v-model="ssid"
          type="text"
          class="pl-9"
          :placeholder="$t('wifi.ssidPlaceholder')"
          autocomplete="off"
        />
      </div>
    </Field>

    <!-- Security -->
    <Field>
      <FieldLabel>{{ $t('wifi.security') }}</FieldLabel>
      <NativeSelect v-model="security" class="w-full">
        <NativeSelectOption
          v-for="opt in securityOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </NativeSelectOption>
      </NativeSelect>
    </Field>

    <!-- Password -->
    <Field v-if="security !== 'nopass'">
      <FieldLabel>{{ $t('wifi.password') }}</FieldLabel>
      <div class="relative">
        <Input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          class="pr-10"
          :placeholder="$t('wifi.passwordPlaceholder')"
          autocomplete="off"
        />
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
          :aria-label="
            showPassword ? $t('wifi.hidePassword') : $t('wifi.showPassword')
          "
          @click="showPassword = !showPassword"
        >
          <EyeOff v-if="showPassword" class="h-4 w-4" />
          <Eye v-else class="h-4 w-4" />
        </button>
      </div>
    </Field>

    <!-- Hidden network -->
    <Field>
      <div class="flex items-center gap-3">
        <Checkbox id="wifi-hidden" v-model:checked="hidden" />
        <label
          for="wifi-hidden"
          class="cursor-pointer text-sm leading-none font-medium"
        >
          {{ $t('wifi.hidden') }}
        </label>
      </div>
      <FieldDescription>{{ $t('wifi.hiddenHint') }}</FieldDescription>
    </Field>
  </FieldGroup>
</template>
