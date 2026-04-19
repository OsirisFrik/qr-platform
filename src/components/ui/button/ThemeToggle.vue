<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import { ButtonIcon } from '.'

const isDark = ref(false)
const mounted = ref(false)

onMounted(() => {
  // Check actual DOM state
  isDark.value = document.documentElement.classList.contains('dark')
  mounted.value = true
})

const toggle = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <ButtonIcon
    v-if="mounted"
    variant="outline"
    size="icon"
    :icon="isDark ? Moon : Sun"
    @click="toggle"
    :aria-label="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
  />
</template>
