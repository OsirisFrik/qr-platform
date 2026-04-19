// @ts-check
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': `${__dirname}/src`
      }
    },
    optimizeDeps: {
      include: [
        '@vueuse/core',
        'lucide-vue-next',
        'qrcode',
        'reka-ui',
        'clsx',
        'tailwind-merge',
        'class-variance-authority'
      ]
    }
  }
})
