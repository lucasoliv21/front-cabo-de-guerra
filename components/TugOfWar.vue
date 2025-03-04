<template>
  <div class="container">
    <div class="header">
      <h2>Cabo de Guerra</h2>
      <p class="maintenance">Manutenção em Andamento</p>
    </div>
    <div class="scoreboard">
      <div class="option">
        <button class="vote-btn fortune-rabbit" @click="vote('fortuneRabbit')">
          Fortune Rabbit 🐰
          <span class="btn-effect"></span>
        </button>
        <p class="vote-count">{{ voteCounts.fortuneRabbit || 0 }} votos</p>
      </div>
      <div class="option">
        <button class="vote-btn fortune-tiger" @click="vote('fortuneTiger')">
          Fortune Tiger 🐯
          <span class="btn-effect"></span>
        </button>
        <p class="vote-count">{{ voteCounts.fortuneTiger || 0 }} votos</p>
      </div>
    </div>

    <!-- Barra de progresso com duas divs (bar-a e bar-b) -->
    <div class="progress">
      <div class="bar bar-a" :style="{ width: progressA + '%' }"></div>
      <div class="bar bar-b" :style="{ width: progressB + '%' }"></div>
    </div>

    <div class="messages">
      <p class="message" v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Armazena os votos de cada opção
const voteCounts = ref({ fortuneRabbit: 0, fortuneTiger: 0 })
const message = ref('')

// Calcula o total de votos e as porcentagens para cada lado
const totalVotes = computed(() => (voteCounts.value.fortuneRabbit || 0) + (voteCounts.value.fortuneTiger || 0))
const progressA = computed(() => {
  return totalVotes.value > 0
    ? (voteCounts.value.fortuneRabbit / totalVotes.value) * 100
    : 50
})
const progressB = computed(() => {
  return totalVotes.value > 0
    ? (voteCounts.value.fortuneTiger / totalVotes.value) * 100
    : 50
})

// Dispara um voto para o backend
function vote(option) {
  axios.post(`http://127.0.0.1:8000/vote/${option}`)
    .then(response => {
      voteCounts.value = response.data.voteCounts
      updateMessage()
    })
    .catch(error => console.error("Erro ao votar:", error))
}

// Ao montar o componente, carrega o placar inicial e escuta eventos
onMounted(() => {
  // Busca o placar atual
  axios.get('http://127.0.0.1:8000/vote/scoreboard')
    .then(response => {
      voteCounts.value = response.data
      updateMessage()
    })
    .catch(error => console.error("Erro ao carregar placar:", error))

  // Conecta ao canal de broadcast
  const echo = useNuxtApp().$echo
  echo.channel('tugofwar')
      .listen('.vote.received', (e) => {
          voteCounts.value = e.voteCounts
          updateMessage()
      })
})

// Atualiza a mensagem de status (quem está na frente)
function updateMessage() {
  if ((voteCounts.value.fortuneRabbit || 0) > (voteCounts.value.fortuneTiger || 0)) {
    message.value = "Fortune Rabbit está na frente!"
  } else if ((voteCounts.value.fortuneTiger || 0) > (voteCounts.value.fortuneRabbit || 0)) {
    message.value = "Fortune Tiger está na frente!"
  } else {
    message.value = "Empate!"
  }
}
</script>

<style scoped>
/* RESET BÁSICO */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  min-height: 100vh;
}

/* CONTAINER PRINCIPAL */
.container {
  max-width: 800px;
  margin: 40px auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  padding: 40px 30px;
  text-align: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* HEADER */
.header h2 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 2.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}
.maintenance {
  color: #e74c3c;
  font-size: 0.95rem;
  margin-bottom: 20px;
  font-weight: 600;
  animation: pulseWarning 1.5s infinite;
}

/* SCOREBOARD */
.scoreboard {
  display: flex;
  justify-content: center;
  margin: 40px 0;
  gap: 50px;
  flex-wrap: wrap;
}

.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 250px;
}

/* BOTÕES DE VOTO */
.vote-btn {
  width: 100%;
  padding: 25px 40px;
  margin-bottom: 15px;
}

/* VOTE COUNT */
.vote-count {
  margin-top: 0;
  width: 100%;
  font-size: 1.3rem;
  padding: 12px 20px;
}

/* BOTÕES DE VOTO */
.vote-btn {
  position: relative;
  border: none;
  padding: 20px 40px;
  font-size: 1.2rem;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  transform-style: preserve-3d;
}
.vote-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

/* BOTÃO FORTUNE RABBIT (ROXO) */
.fortune-rabbit {
  background: linear-gradient(45deg, #8e44ad, #9b59b6);
  box-shadow: 0 8px 30px rgba(142, 68, 173, 0.4);
}

/* BOTÃO FORTUNE TIGER (LARANJA) */
.fortune-tiger {
  background: linear-gradient(45deg, #FFA500, #FF8C00);
  box-shadow: 0 8px 30px rgba(255, 165, 0, 0.4);
}

/* EFEITO DE PULSO NO CLIQUE */
.vote-btn .btn-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
  animation: pulse 0.6s ease-out forwards;
}
.vote-btn:active .btn-effect {
  width: 200%;
  height: 200%;
  opacity: 0;
}
@keyframes pulse {
  0% {
    width: 0;
    height: 0;
    opacity: 0.7;
  }
  100% {
    width: 200%;
    height: 200%;
    opacity: 0;
  }
}

/* VOTE COUNT */
.vote-count {
  margin-top: 15px;
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
  position: relative;
  display: inline-block;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* BARRA DE PROGRESSO */
.progress {
  height: 40px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  overflow: hidden;
  margin: 30px 0;
  position: relative;
  box-shadow: inset 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex; /* Adicionado */
}

.bar {
  height: 100%;
  transition: width 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  flex-shrink: 0; /* Impede que as barras encolham */
}

/* Barra do Fortune Rabbit (Roxo - Gradiente invertido) */
.bar-a {
  background: linear-gradient(45deg, #9b59b6, #64008e);
}

/* Barra do Fortune Tiger (Laranja - Gradiente invertido) */
.bar-b {
  background: linear-gradient(45deg, #ff7f50, #ffa500);
}

/* Ajuste no overlay de brilho */
.bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 75%,
    rgba(255,255,255,0.4) 50%,
    transparent 75%
  );
  animation: progressShine 3s infinite linear;
}

/* MENSAGEM */
.messages .message {
  font-size: 1.4rem;
  font-weight: 600;
  padding: 15px 30px;
  border-radius: 50px;
  display: inline-block;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* ANIMAÇÃO DO AVISO DE MANUTENÇÃO */
@keyframes pulseWarning {
  0% { opacity: 0.8; }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.8; }
}
</style>
