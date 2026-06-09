// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

// Apex host used to derive subdomains. Set `NUXT_HOST` to the dev host
// (e.g. `trailassociation.test`) for local subdomain testing.
const host = process.env.NUXT_HOST || 'trailassociation.uk'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    public: {
      host,
    },
    session: {
      password: process.env.NUXT_SESSION_PASSWORD!,
      cookie: {
        // Scope the session cookie to the apex (`.<apex>`) so it is shared
        // across the apex and every association subdomain — otherwise creating
        // an association and landing on its subdomain logs the user out.
        domain: `.${host}`,
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
  routeRules: {
    '/': { prerender: true },
    '/login': { prerender: true },
    '/signup': { prerender: true },
    '/admin/**': { ssr: false },
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
    server: {
      // Allow the apex dev host and every association subdomain
      // (`*.<apex>`) through Vite's dev-server host check.
      allowedHosts: [`.${host}`],
    },
  },
})