<script setup lang="ts">
import { Github, Star } from 'lucide-vue-next'

const REPO = 'OsirisFrik/qr-platform'

const { data: stars } = await useFetch<number>(`https://api.github.com/repos/${REPO}`, {
  key: 'github-stars',
  transform: (res: any) => res.stargazers_count as number,
  default: () => 0,
  server: true,
})
</script>

<template>
  <Button variant="outline" size="sm" as-child>
    <a
      :href="`https://github.com/${REPO}`"
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center gap-1.5"
    >
      <Github class="h-4 w-4" />
      <span class="flex items-center gap-1">
        <Star class="h-3.5 w-3.5" />
        {{ stars }}
      </span>
    </a>
  </Button>
</template>
