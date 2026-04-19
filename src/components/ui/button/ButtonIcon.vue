<script lang="ts" setup>
import { Loader } from 'lucide-vue-next'
import type { PrimitiveProps } from 'reka-ui'
import type { Component, HTMLAttributes } from 'vue'
import type { ButtonVariants } from '.'
import Button from './Button.vue'

interface Props extends /* @vue-ignore */ PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  icon: Component
  iconSize?: string
  loading?: boolean
  tabindex?: string
}

const props = defineProps<Props>()
</script>
<template>
  <Button v-bind="props">
    <component
      :is="!loading ? icon : Loader"
      :class="{
        'animate-spin': loading
      }"
    />
    <slot />
  </Button>
</template>
