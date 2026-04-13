<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'
import type { Component, HTMLAttributes } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import type { ButtonVariants } from '.'
import Button from './Button.vue'
import ButtonIcon from './ButtonIcon.vue'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  icon?: Component
  to: RouteLocationRaw
}

const props = defineProps<Props>()
const router = useRouter()

function onClick() {
  if (props.to) {
    router.push(props.to)
  }
}
</script>
<template>
  <component :is="!icon ? Button : ButtonIcon" v-bind="props" @click="onClick">
    <slot />
  </component>
</template>
