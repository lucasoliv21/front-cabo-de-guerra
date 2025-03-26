import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      PUSHER_APP_KEY: process.env.NUXT_PUBLIC_PUSHER_APP_KEY,
      PUSHER_APP_CLUSTER: process.env.NUXT_PUBLIC_PUSHER_APP_CLUSTER
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ]
  },

  css: ['~/assets/css/main.css'],
  compatibilityDate: "2025-03-03",
  modules: ['@pinia/nuxt'],

  devtools: {
    enabled: true,
  },

  sourcemap: true,
})