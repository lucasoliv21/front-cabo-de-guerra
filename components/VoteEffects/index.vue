<template>
  <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
    <div 
      v-for="effect in effects" 
      :key="effect.id"
      class="vote-effect"
      :class="{
        'vote-effect-home': effect.side === 'home',
        'vote-effect-away': effect.side === 'away'
      }"
    >
      +1 voto
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  effects: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.vote-effect {
  position: absolute;
  top: 50%; 
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  color: white;
  animation: vote-fly 1s ease-out forwards;
}

.vote-effect-home {
  color: #4ade80;
}

.vote-effect-away {
  color: #60a5fa;
}

@keyframes vote-fly {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -200%) scale(0.8);
    opacity: 0;
  }
}
</style>
