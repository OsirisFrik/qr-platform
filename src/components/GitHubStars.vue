<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Github, Star } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'

const REPO = 'OsirisFrik/qr-platform'
const stars = ref(0)

onMounted(async () => {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`)
    const data = await res.json()
    stars.value = data.stargazers_count || 0
  } catch (err) {
    console.error('Failed to fetch GitHub stars:', err)
    stars.value = 0
  }
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
