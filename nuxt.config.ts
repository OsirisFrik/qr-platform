// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['@/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [
        'https://tigers-childhood-bridal-boss.trycloudflare.com/',
        '8263-201-170-65-198.ngrok-free.app'
      ]
    },
    optimizeDeps: {
      include: [
        '@vueuse/core',
        'lucide-vue-next',
        'class-variance-authority',
        'reka-ui',
        'qrcode', // CJS
        'clsx',
        'tailwind-merge'
      ]
    }
  },

  modules: [
    'shadcn-nuxt',
    '@nuxtjs/i18n',
    '@vercel/speed-insights',
    '@vercel/analytics'
  ],

  // shad-cn configs
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
  },

  // i18n configs
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English',
        iso: 'en-US',
        file: 'en.json'
      },
      {
        code: 'es',
        name: 'Español',
        iso: 'es-ES',
        file: 'es.json'
      }
    ]
  },

  typescript: {
    tsConfig: {
      include: ['types/**/*.d.ts']
    }
  },
  app: {
    head: {
      title: 'QR Code Generator',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      htmlAttrs: {
        class: 'dark'
      }
    }
  }
})
