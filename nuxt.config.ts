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
    }
  },

  modules: ['shadcn-nuxt', '@nuxtjs/i18n'],

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

  // supabase configs
  // supabase: {
  //   redirect: true,
  //   redirectOptions: {
  //     login: '/login',
  //     callback: '/login/confirm',
  //     include: ['/dashboard'],
  //     saveRedirectToCookie: true
  //   }
  // },

  // i18n configs
  i18n: {
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English',
        iso: 'en-US',
        file: 'en/index.ts'
      },
      {
        code: 'es',
        name: 'Español',
        iso: 'es-ES',
        file: 'es/index.ts'
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
