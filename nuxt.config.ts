// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    session: {
      password: process.env.NUXT_SESSION_PASSWORD!,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  app: {
    head: {
      title: 'Trail Association UK', // default fallback title
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  devtools: { enabled: true },
  modules: ['shadcn-nuxt', 'nuxt-auth-utils'],
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui'
  },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})