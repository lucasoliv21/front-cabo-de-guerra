import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      wsUrl: process.env.WS_URL || 'ws://localhost:9502',
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: ["howler"],
    },
  },

  css: ['~/assets/css/main.css'],
  compatibilityDate: "2025-03-03",
  modules: ['@pinia/nuxt', '@vueuse/sound/nuxt'],

  sound: {
    sounds: {
      scan: true,
    },
  },

  devtools: {
    enabled: true,
  },

  sourcemap: true,
})