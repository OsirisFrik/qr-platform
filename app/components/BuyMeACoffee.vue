<script setup lang="ts">
import { Coffee } from 'lucide-vue-next'

const buyMeCoffeeUrl = 'https://buymeacoffee.com/osirisfrik'

const handleClick = () => {
  window.open(buyMeCoffeeUrl, '_blank')
}
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="outline"
          size="icon"
          @click="handleClick"
          aria-label="Buy me a coffee"
          class="hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950 dark:hover:text-amber-200"
        >
          <Coffee class="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Buy me a coffee ☕</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
