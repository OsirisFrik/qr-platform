<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { Moon, Sun } from 'lucide-vue-next'
import { ButtonIcon } from '.'

const isDark = useDark()
</script>

<template>
  <ButtonIcon
    variant="outline"
    size="icon"
    :icon="isDark ? Moon : Sun"
    @click="isDark = !isDark"
    :aria-label="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
  />
</template>
