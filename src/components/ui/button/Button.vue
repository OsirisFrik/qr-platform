<script setup lang="ts">
import { cn } from '@/utils/shadUtils'
import type { PrimitiveProps } from 'reka-ui'
import { Primitive } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { ButtonVariants } from '.'
import { buttonVariants } from '.'

interface Props extends /* @vue-ignore */ PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  tabindex?: string
  as?: string
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  asChild: false
})
</script>

<template>
  <Primitive
    data-slot="button"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    :tabindex="tabindex"
  >
    <slot />
  </Primitive>
</template>
