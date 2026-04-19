<script setup lang="ts">
import QRGenerator from './QRGenerator.vue'
import GitHubStars from './GitHubStars.vue'
import BuyMeACoffee from './BuyMeACoffee.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ThemeToggle from '@/components/ui/button/ThemeToggle.vue'
</script>

<template>
  <div
    class="from-background via-background to-muted flex min-h-screen items-center justify-center bg-linear-to-br p-4"
  >
    <QRGenerator />
    <div class="fixed top-6 right-6 flex items-center gap-2">
      <GitHubStars />
      <BuyMeACoffee />
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  </div>
</template>
