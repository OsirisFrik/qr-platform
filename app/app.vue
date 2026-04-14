<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import { Toaster } from 'vue-sonner'

import 'vue-sonner/style.css'

useSeoMeta({
  title: $t('title'),
  ogTitle: $t('title'),
  description: $t('subtitle'),
  ogDescription: $t('subtitle'),
  ogImage: '/thumbnail.png',
  ogImageHeight: 300,
  ogImageWidth: 300
})

useDark()
</script>
<template>
  <Toaster />
  <NuxtPage />
</template>
