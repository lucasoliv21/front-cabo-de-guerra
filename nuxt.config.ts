export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      PUSHER_APP_KEY: process.env.NUXT_PUBLIC_PUSHER_APP_KEY,
      PUSHER_APP_CLUSTER: process.env.NUXT_PUBLIC_PUSHER_APP_CLUSTER
    }
  },

  compatibilityDate: "2025-03-03",
})