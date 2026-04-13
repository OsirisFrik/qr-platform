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
  { value: 'nopass', label: 'None' },
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
      <FieldLabel>{{ $t('qr.wifi.ssid') }}</FieldLabel>
      <div class="relative">
        <Wifi class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="ssid"
          type="text"
          class="pl-9"
          :placeholder="$t('qr.wifi.ssidPlaceholder')"
          autocomplete="off"
        />
      </div>
    </Field>

    <!-- Security -->
    <Field>
      <FieldLabel>{{ $t('qr.wifi.security') }}</FieldLabel>
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
      <FieldLabel>{{ $t('qr.wifi.password') }}</FieldLabel>
      <div class="relative">
        <Input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          class="pr-10"
          :placeholder="$t('qr.wifi.passwordPlaceholder')"
          autocomplete="off"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          :aria-label="showPassword ? $t('qr.wifi.hidePassword') : $t('qr.wifi.showPassword')"
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
        <label for="wifi-hidden" class="cursor-pointer text-sm font-medium leading-none">
          {{ $t('qr.wifi.hidden') }}
        </label>
      </div>
      <FieldDescription>{{ $t('qr.wifi.hiddenHint') }}</FieldDescription>
    </Field>
  </FieldGroup>
</template>
