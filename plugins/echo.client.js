import Echo from "laravel-echo"
import Pusher from "pusher-js"

export default defineNuxtPlugin(() => {
  // Pegamos as variáveis do runtimeConfig
  const { public: { PUSHER_APP_KEY, PUSHER_APP_CLUSTER } } = useRuntimeConfig()

  const echo = new Echo({
    broadcaster: 'pusher',
    key: PUSHER_APP_KEY,
    cluster: PUSHER_APP_CLUSTER,
    forceTLS: true
  })

  return {
    provide: {
      echo
    }
  }
})
