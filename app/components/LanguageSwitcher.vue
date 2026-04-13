<script setup lang="ts">
import { Languages } from 'lucide-vue-next'

const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() =>
  locales.value.filter((l) => l.code !== locale.value)
)
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm" class="gap-1.5">
        <Languages class="h-4 w-4" />
        {{ locale.toUpperCase() }}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="l in availableLocales"
        :key="l.code"
        class="cursor-pointer"
        @click="setLocale(l.code)"
      >
        {{ l.name }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
