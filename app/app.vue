<script lang="ts" setup>
import { useDark } from '@vueuse/core'

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
  <NuxtPage />
</template>
