<script lang="ts" setup>
import { ThemeToggle } from '@/components/ui/button'
</script>

<template>
  <div
    class="from-background via-background to-muted flex min-h-screen items-center justify-center bg-gradient-to-br p-4"
  >
    <QRGenerator />
    <div class="fixed right-6 bottom-6">
      <ThemeToggle />
    </div>
  </div>
</template>
