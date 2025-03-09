import { confetti } from "@tsparticles/confetti"

export default defineNuxtPlugin(() => {
  return {
    provide: {
      confetti
    }
  }
})
