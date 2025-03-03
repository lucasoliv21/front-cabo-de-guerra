<template>
  <div class="tug-of-war">
    <h2>Cabo de Guerra</h2>
    <div class="scoreboard">
      <div class="option">
        <button @click="vote('opcaoA')">Opção A</button>
        <p>{{ voteCounts.opcaoA || 0 }} votos</p>
      </div>
      <div class="option">
        <button @click="vote('opcaoB')">Opção B</button>
        <p>{{ voteCounts.opcaoB || 0 }} votos</p>
      </div>
    </div>

    <div class="progress">
      <div class="bar bar-a" :style="{ width: progressA + '%' }"></div>
      <div class="bar bar-b" :style="{ width: progressB + '%' }"></div>
    </div>

    <div class="messages">
      <p v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const voteCounts = ref({ opcaoA: 0, opcaoB: 0 })
const message = ref('')

// Funções computadas para calcular progress bars
const totalVotes = computed(() => (voteCounts.value.opcaoA || 0) + (voteCounts.value.opcaoB || 0))
const progressA = computed(() => totalVotes.value > 0 ? (voteCounts.value.opcaoA / totalVotes.value) * 100 : 50)
const progressB = computed(() => totalVotes.value > 0 ? (voteCounts.value.opcaoB / totalVotes.value) * 100 : 50)

function vote(option) {
  axios.post(`http://127.0.0.1:8000/vote/${option}`)
    .then(response => {
      voteCounts.value = response.data.voteCounts
    })
    .catch(error => console.error("Erro ao votar:", error))
}

// Carrega o placar atual e configura o canal de broadcast
onMounted(() => {
  // 1. Buscar o placar atual
  axios.get('http://127.0.0.1:8000/vote/scoreboard')
    .then(response => {
      voteCounts.value = response.data
      updateMessage()
    })
    .catch(error => console.error("Erro ao carregar placar:", error))

  // 2. Conectar ao Echo/Pusher para receber updates em tempo real
  const echo = useNuxtApp().$echo
  echo.channel('tugofwar')
      .listen('.vote.received', (e) => {
          voteCounts.value = e.voteCounts
          updateMessage()
      })
})

// Função para atualizar a mensagem de "Time X está na frente!"
function updateMessage() {
  if ((voteCounts.value.opcaoA || 0) > (voteCounts.value.opcaoB || 0)) {
    message.value = "Time A está na frente!"
  } else if ((voteCounts.value.opcaoB || 0) > (voteCounts.value.opcaoA || 0)) {
    message.value = "Time B está na frente!"
  } else {
    message.value = "Empate!"
  }
}
</script>


<style scoped>
.tug-of-war {
  text-align: center;
}
.scoreboard {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.option {
  margin: 0 20px;
}
.progress {
  display: flex;
  height: 30px;
  background: #eee;
  margin-bottom: 10px;
}
.bar {
  transition: width 0.5s;
}
.bar-a {
  background: #4caf50;
}
.bar-b {
  background: #f44336;
}
</style>
