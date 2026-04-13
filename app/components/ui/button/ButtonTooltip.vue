<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'
import type { Component, HTMLAttributes } from 'vue'
import { Button, ButtonIcon, type ButtonVariants } from '.'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../tooltip'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  icon?: Component
  iconSize?: string
  loading?: boolean
  tooltip?: string
}

const props = defineProps<Props>()
</script>
<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <component
          :is="props.icon ? ButtonIcon : Button"
          v-bind="props"
          @click="$emit('click')"
        >
          <slot />
        </component>
      </TooltipTrigger>
      <TooltipContent>
        {{ tooltip }}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
