<script setup lang="ts">
import { cn } from '@/utils/shadUtils'
import { computed, ref, watch, type HTMLAttributes } from 'vue'

export interface IconSvgProps {
  /**
   * Nombre del archivo SVG sin extensión
   * Ej: 'google-line', 'google-fill'
   */
  name: string
  /**
   * Tamaño del icono en píxeles
   * @default 24
   */
  size?: number | string
  /**
   * Clases CSS adicionales
   */
  class?: HTMLAttributes['class']
  /**
   * Color del icono
   */
  color?: string
  /**
   * ARIA label para accesibilidad
   */
  ariaLabel?: string
}

const props = withDefaults(defineProps<IconSvgProps>(), {
  size: 24
})

const sizeStyles = computed(() => {
  const sizeValue =
    typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: sizeValue,
    height: sizeValue,
    minWidth: sizeValue,
    minHeight: sizeValue
  }
})

const svgContent = ref<string | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const loadSvg = async () => {
  if (!props.name) return

  isLoading.value = true
  error.value = null
  svgContent.value = null

  try {
    const response = await fetch(`/svg/${props.name}.svg`)
    if (!response.ok) {
      throw new Error(`SVG "${props.name}" no encontrado`)
    }
    svgContent.value = await response.text()
  } catch (err) {
    error.value = `Error cargando icon "${props.name}": ${err instanceof Error ? err.message : 'Desconocido'}`
    console.warn(error.value)
  } finally {
    isLoading.value = false
  }
}

watch(() => props.name, loadSvg, { immediate: true })
</script>

<template>
  <div
    v-if="svgContent"
    :style="sizeStyles"
    :class="cn('inline-block', props.class)"
    :aria-label="ariaLabel"
    v-html="svgContent"
  />
  <span
    v-else-if="isLoading"
    :style="sizeStyles"
    class="inline-block animate-pulse"
  >
    ⏳
  </span>
  <span
    v-else
    class="text-red-500"
    :title="error || `Icon not found: ${props.name}`"
    :aria-label="`Icon not found: ${props.name}`"
  >
    ⚠️
  </span>
</template>
