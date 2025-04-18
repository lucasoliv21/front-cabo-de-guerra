<script setup>
import { ulid } from 'ulid';
import { useWebsocket } from '~/stores/websocket';

const { $confetti } = useNuxtApp();

const connection = ref('pending');

const ephemeralEffects = ref([]); 

useHead({
    title: 'Gol de Habilidade - Check Goal',
    // add favicon svg
    link: [
        {
            rel: 'icon',
            type: 'image/svg+xml',
            href: '/favicon.svg',
        },
    ],
    meta: [
        {
            name: 'description',
            content: 'Gol de Habilidade é um jogo de click online onde o objetivo é mostrar suas habilidades para fazer gols incríveis. Experimente e divirta-se marcando gols espetaculares!',
        },
        {
            name: 'keywords',
            content: 'gol, habilidade, click, online, jogo, futebol, gol de habilidade, check goal, futebol, esportes, diversao',
        },
        {
            name: 'author',
            content: 'Lucas César e Arthur Henrique',
        }
    ],
});

const state = ref({
  game: {},
  stats: {}, 
  gameHistory: [],
  player: {},
  shop: [],
  count: 1,
});

// top 5 toggle
const top5 = ref(true);

const timeLeft = ref(0);

let timerInterval = null;

// Confeti on winner
watch(
    () => state.value.game.status,
    (newState, oldState) => {
        if (newState === oldState) {
            return;
        }

        if (newState !== 'finished') {
            return;
        }

        // Se o jogo empatou, não dispara confeti
        if (state.value.game.homeVotes === state.value.game.awayVotes) {
            return;
        }

        const defaults = {
            spread: 360,
            ticks: 50,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            shapes: ["star"],
            colors: ["FFD700", "FFDF00"],
        };

        function shoot() {
            confetti({
                ...defaults,
                particleCount: 40,
                scalar: 1.2,
                shapes: ["star"],
            });

            confetti({
                ...defaults,
                particleCount: 10,
                scalar: 0.75,
                shapes: ["star"],
            });
        }

        setTimeout(shoot, 0);
        setTimeout(shoot, 100);
        setTimeout(shoot, 200);
    }
)

const websocket = useWebsocket();

const selectTeam = (team) => {
    if (state.value.game.status !== 'waiting') {
      console.log("Seleção de time só pode ocorrer na fase 'waiting'.");
      return;
    }
    
    websocket.ws.send(`select-${team}`);
};

const playerTeamIsSelected = computed(() => {
    return state.value.player.currentTeam !== null;
});

const playerTeamIsHome = computed(() => {
    return state.value.player.currentTeam === state.value.game.homeName;
});

const playerTeamIsAway = computed(() => {
    return state.value.player.currentTeam === state.value.game.awayName;
});

const playerHasWon = computed(() => {
    const teamWinner = gameWinner.value;

    return state.value.player.currentTeam === teamWinner 
        || state.value.player.currentTeam === teamWinner;
});

const scoreboard = computed(() => {
  let entries = Object.entries(state.value.stats);

  entries = entries.filter(([teamName, stats]) => stats.played > 0 && stats.winRate > 0); //nao vamos mostrar times que nao jogaram e nao ganharam
  entries.sort((a, b) => b[1].winRate - a[1].winRate);
  // Retorna os 5 primeiros
  return entries.slice(0, 5).map(([teamName, stats]) => ({
    teamName,
    winRate: stats.winRate,
    played: stats.played,
    won: stats.won,
  }));
});

const getToken = () => {
    let token = localStorage.getItem('user-token');

    if (! token) {
        token = ulid();
        localStorage.setItem('user-token', token);
    }

    return token;
}

onMounted(() => {
    const userToken = getToken();

    websocket.connect(userToken);

    websocket.ws.onopen = function() {
        console.log('Conectado!');
        connection.value = 'connected';

        websocket.ws.send('send-state');
    };

    websocket.ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === 'vote-response') {
        if (data.status !== 'success') {
            showEphemeralMessage(data.payload.message);
        }

        return;
      }

      if (data.type === 'voted') {
        let currentVotes = 0;
        let angle = 0;
        let flag = '';
        let position = { x: 0 };

        if (data.payload.team === 'home') {
            angle = Math.floor(Math.random() * 80) - 40;
            flag = state.value.game.homeFlag;
            position = { x: 0 };
            state.value.game.homeVotes++;
            currentVotes = state.value.game.homeVotes;
        } else {
            angle = Math.floor(Math.random() * 80) + 140;
            flag = state.value.game.awayFlag;
            position = { x: 1 };
            state.value.game.awayVotes++;
            currentVotes = state.value.game.awayVotes;
        }

        if (data.payload.self) {
            ephemeralEffects.value.push({
                id: Date.now() + Math.random(),
                side: data.payload.team,
            });

            setTimeout(() => ephemeralEffects.value.shift(), 1000);
        }

        let confettiCount = data.payload.features.includes('count') ? 2 : 1
        
        if (currentVotes % 1000 === 0) {
            confettiCount = data.payload.features.includes('count-2') ? 3000 : 1000;
        } else if (currentVotes % 100 === 0) {
            confettiCount = data.payload.features.includes('count-2') ? 300 : 100;
        } else if (currentVotes % 10 === 0) {
            confettiCount = data.payload.features.includes('count-2') ? 50 : 10;
        }

        $confetti({
            particleCount: confettiCount,
            spread: 70,
            angle: angle,
            scalar: data.payload.features.includes('big') ? 5 : 2,
            origin: position,
            shapes: ["image"],
            shapeOptions: {
                image: {
                    src: flag,
                    replaceColor: true,
                    width: 32,
                    height: 40,
                },
            },
        });
      }

      if (data.type === 'connected') {
        state.value.count++;
      }

        if (data.type === 'disconnected') {
            state.value.count--;
        }

      if (data.game) {
        state.value.game = data.game;
        updateTimer();
      }
      if (data.stats) {
        state.value.stats = data.stats;
      }
      if (data.history) {
        state.value.gameHistory = data.history;
      }
      if (data.player) {
        state.value.player = data.player;
      }

      if (data.shop) {
        state.value.shop = data.shop;
      }

      if (data.count) {
        state.value.count = data.count;
      }
    };

    websocket.ws.onclose = function() {
        console.log('Desconectado!');
        connection.value = 'disconnected';
    };

    websocket.ws.onerror = function(err) {
        console.error('Erro:', err);
        connection.value = 'disconnected';
    };
    
    timerInterval = setInterval(updateTimer, 1000);
})

const ephemeralMessages = ref([]);

function showEphemeralMessage(text, duration = 1000) {
  const msg = {
    id: Date.now() + Math.random(),
    text,
  };

  ephemeralMessages.value.push(msg);

  setTimeout(() => {
    ephemeralMessages.value = ephemeralMessages.value.filter(m => m.id !== msg.id);
  }, duration);
}

onUnmounted(() => {
  clearInterval(timerInterval);
});

const gameStatus = computed(() => {
  const status = state.value.game?.status;
  switch (status) {
    case 'waiting': return 'Aguardando início';
    case 'running': return 'Em andamento';
    case 'finished': return 'Finalizado';
    default: return '--';
  }
});

const gameWinner = computed(() => {
  if (state.value.game?.status !== 'finished') {
    return '--';
  }

  if (state.value.game.homeVotes === state.value.game.awayVotes) {
    return 'Empate';
  }

  return state.value.game.homeVotes > state.value.game.awayVotes
    ? state.value.game.homeName
    : state.value.game.awayName;
});

function updateTimer() {

  if (state.value.game.phaseStart && state.value.game.phaseDuration) {
    const now = Math.floor(Date.now() / 1000);
    const elapsed = now - state.value.game.phaseStart;

    timeLeft.value = Math.max(state.value.game.phaseDuration - elapsed, 0);
  } else {
    timeLeft.value = 0;
  }
}

</script>

<template>
    <div>
        <div v-if="connection === 'disconnected'">
            <p class="absolute bg-red-500 top-5 left-5 rounded-md text-xs p-1 text-white uppercase font-bold select-none">
                Erro de conexão! Atualize a página e verifique se o jogo está aberto em outra aba.
            </p>
        </div>
        <div v-else-if="connection === 'pending'">
            <p class="absolute bg-yellow-500 top-5 left-5 rounded-md text-xs p-1 text-white uppercase font-bold select-none">
                Conectando...
            </p>
        </div>

        <!-- Conectado -->
        <div v-else>

            <!-- Table: Top 5 Win Rates -->
            <div class="absolute top-0 right-0 m-4 bg-white border rounded shadow transition-all duration-1000 ease-in-out">

                <!-- Header Table-->
                <div @click="top5 = !top5" class="flex p-1 cursor-pointer bg-blue-200 rounded-t justify-between items-center">
                    <p class="font-bold text-sm">Top 5 Win Rates</p>
                    <span v-show="top5">✖</span>
                    <span v-show="!top5">➕</span>
                </div>

                <!-- Body Table: add transition tailwind -->
                <div :class="[top5 ? 'h-30' : 'h-0 opacity-0']" class="transition-all duration-1000 ease-in-out">
                  <!-- Se scoreboard estiver vazio, mostra a mensagem -->
                  <div v-if="scoreboard.length === 0">
                    <p class="text-sm px-2 py-1">Nenhuma vitória registrada!</p>
                  </div>
                  <!-- Caso contrário, exibe a lista -->
                  <ul v-else>
                    <li
                      v-for="(item, index) in scoreboard"
                      :key="index"
                      class="text-sm px-2 py-0.5"
                    >
                      {{ index + 1 }}. {{ item.teamName }} - {{ (item.winRate * 100).toFixed(2) }}%
                    </li>
                  </ul>
                </div>
            </div>
            
            <div class="absolute top-5 left-1/2 transform -translate-x-1/2 z-50">
                <div
                  v-for="message in ephemeralMessages"
                  :key="message.id"
                  class="mb-2 px-3 py-1 bg-red-600 text-white rounded shadow"
                >
                  {{ message.text }}
                </div>
            </div>

            <p class="absolute bg-green-500 top-5 left-5 rounded-md text-xs p-1 text-white uppercase font-bold select-none">{{ state.count }} Player(s) online</p>
            <div class="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded text-base z-50">
                {{ gameStatus }}
            </div>
            <!-- Team showoff -->
            <div v-show="state.game.status === 'waiting'">
                <div class="flex flex-col gap-2 justify-center items-center bg-gradient-to-br from-[#50C9C3] to-[#96DEDA] min-h-screen">
                    
                    <div class="container">
                        <GameProgressBar 
                            :timeLeft="timeLeft"
                            :timeTotal="state.game.phaseDuration"
                            timeText="O evento está começando em"
                        />
                    </div>
                    
                    <div class="bg-white container items-center mx-2 p-2 gap-4 rounded flex flex-col">
                        <p class="font-bold text-4xl text-center">Escolha seu time:</p>
                        <div class="flex w-full gap-5 justify-around items-center">
                            
                            <!-- Home -->
                            <div
                                @click="selectTeam('home')"
                                :class="[playerTeamIsSelected && playerTeamIsHome ? 'bg-emerald-400' : 'bg-slate-100 hover:bg-slate-300']"
                                class="w-1/3 select-none undraggable cursor-pointer group rounded-lg flex gap-2 py-2 flex-col items-center"
                                >
                                <img 
                                    :src="state.game.homeFlag" 
                                    alt="home" 
                                    :class="[playerTeamIsSelected && playerTeamIsHome ? 'animate-none' : 'animate-pulse group-hover:animate-none']"
                                    class="w-20 h-20 mx-auto"
                                    >
                                <p class="text-center font-bold flex gap-1"><span :class="[playerTeamIsHome ? 'hidden' : 'group-hover:block hidden']">Escolher </span>{{ state.game.homeName }}</p>
                            </div>

                            <!-- VS -->
                             <p class="lg:text-lg">vs.</p>


                            <!-- Away -->
                            <div
                                @click="selectTeam('away')"
                                :class="[playerTeamIsSelected && playerTeamIsAway ? 'bg-emerald-400' : 'bg-slate-100 hover:bg-slate-300']"
                                class="w-1/3 select-none undraggable cursor-pointer group rounded-lg flex gap-2 py-2 flex-col items-center"
                                >
                                <img 
                                    :src="state.game.awayFlag" 
                                    alt="away" 
                                    :class="[playerTeamIsSelected && playerTeamIsAway ? 'animate-none' : 'animate-pulse group-hover:animate-none']"
                                    class="w-20 h-20 mx-auto"
                                    >
                                <p class="text-center font-bold flex gap-1"><span :class="[playerTeamIsAway ? 'hidden' : 'group-hover:block hidden']">Escolher </span>{{ state.game.awayName }}</p>
                            </div>

                        </div>

                        <!-- <div class="flex cursor-wait grow w-full gap-5 p-2  text-black rounded justify-around items-center">
                            Votação inicia em breve...
                        </div> -->
                    </div>
                    
                    <KeepAlive>
                        <GameHistory :gameHistory="state.gameHistory" />
                    </KeepAlive>

                    <!-- <KeepAlive> -->
                        <GameProfile :shop="state.shop" :player="state.player" :game="state.game" />
                    <!-- </KeepAlive> -->
                    
                    <!-- <p>Os times que irão disputar são:</p>
                    <p>{{ state.homeName }}</p>
                    <p>{{ state.awayName }}</p> -->
                </div>
            </div>

            <!-- Voting -->
            <div v-show="state.game.status === 'running'">
                <div class="flex flex-col gap-2 justify-center items-center bg-gradient-to-br from-[#50C9C3] to-[#96DEDA] min-h-screen">
                    <div class="container">
                        <GameProgressBar 
                            :timeLeft="timeLeft"
                            :timeTotal="state.game.phaseDuration"
                            timeText="A votação acaba em"
                        />
                    </div>
                    
                    <div class="bg-white container items-center mx-2 p-2 gap-4 rounded flex flex-col">
                        <p class="font-bold text-center text-4xl">Vote no seu time favorito:</p>
                        <div class="flex w-full gap-5 justify-around items-center">
                            
                            <!-- Home -->
                            <div 
                                class="w-1/3 rounded undraggable"
                                >
                                <img :src="state.game.homeFlag" alt="home" class="w-20 select-none animate-bounce h-20 mx-auto">
                                <p class="text-center">
                                    <span 
                                        :class="[playerTeamIsSelected && playerTeamIsHome ? 'bg-gradient-to-b from-[#F7971E] to-[#FFD200] font-bold' : '']"
                                        class="p-0.5 rounded text-xs"
                                        >{{ state.game.homeName }}
                                    </span>
                                </p>
                            </div>

                            <!-- VS -->
                             <p>vs.</p>


                            <!-- Away -->
                            <div class="w-1/3 rounded undraggable">
                                <img :src="state.game.awayFlag" alt="home" class="w-20 select-none animate-bounce h-20 mx-auto">
                                <p class="text-center">
                                    <span 
                                        :class="[playerTeamIsSelected && playerTeamIsAway ? 'bg-gradient-to-b from-[#F7971E] to-[#FFD200] font-bold' : '']"
                                        class="p-0.5 rounded text-xs"
                                        >{{ state.game.awayName }}
                                    </span>
                                </p>
                            </div>

                        </div>

                        <div class="flex gap-5 justify-around items-center">
                            <GameButton 
                                team="home"
                                :disabled="state.game.status !== 'running'"
                                variant="primary"
                                >
                                <img :src="state.game.homeFlag" alt="home" class="w-10 h-10">
                            </GameButton>

                            <GameButton
                                team="away"
                                :disabled="state.game.status !== 'running'"
                                variant="secondary"
                                >
                                <img :src="state.game.awayFlag" alt="away" class="w-10 h-10">
                            </GameButton>
                        </div>
                    </div>
                    
                    <KeepAlive>
                        <GameHistory :gameHistory="state.gameHistory" />
                    </KeepAlive>

                    <!-- <KeepAlive> -->
                        <GameProfile :shop="state.shop" :player="state.player" :game="state.game" />
                    <!-- </KeepAlive> -->
                </div>
            </div>

            <!-- Winner screen -->
            <div v-show="state.game.status === 'finished'">
                <div class="flex flex-col gap-2 justify-center items-center bg-gradient-to-br from-[#50C9C3] to-[#96DEDA] min-h-screen">
                    <div class="container bg-white">
                        <GameProgressBar 
                            :timeLeft="timeLeft"
                            :timeTotal="state.game.phaseDuration"
                            timeText="Iniciando uma nova partida em"
                        />
                    </div>
                    
                    <div class="bg-white container items-center mx-2 p-2 gap-4 rounded flex flex-col">
                        <p class="font-bold text-center text-4xl">Vencedor da Rodada</p>
                        <div class="flex w-full gap-5 justify-around items-center">
                            
                            <!-- Home -->
                            <div :class="{'bg-black/5 animate-pulse': gameWinner === state.game.homeName}" class="w-1/3 undraggable flex py-2 rounded-lg flex-col items-center">
                                <p class="text-7xl">{{ state.game.homeVotes }}</p>
                                <br>
                                <div class="relative">
                                    <img :src="state.game.homeFlag" alt="home" class="w-20 h-20 mx-auto">
                                    <img :class="{'animate-ping': gameWinner === state.game.homeName}" :src="state.game.homeFlag" alt="home" class="absolute  select-none top-0 left-0 w-20 h-20 mx-auto">
                                </div>
                                <p class="text-center">{{ state.game.homeName }}</p>
                                <p class="text-center" v-if="state.stats[state.game.homeName]">
                                    Win Rate: 
                                    {{ (state.stats[state.game.homeName].winRate * 100).toFixed(2) }}%
                                  </p>
                            </div>

                            <!-- VS -->
                             <p>vs.</p>


                            <!-- Away -->
                            <div :class="{'bg-black/5': gameWinner === state.game.awayName}" class="w-1/3 undraggable flex py-2 rounded-lg flex-col items-center">
                                <p class="text-7xl">{{ state.game.awayVotes }}</p>
                                <br>
                                <div class="relative">
                                    <img :src="state.game.awayFlag" alt="away" class="w-20 h-20 mx-auto">
                                    <img :class="{'animate-ping': gameWinner === state.game.awayName}" :src="state.game.awayFlag" alt="away-2" class="absolute select-none top-0 left-0 w-20 h-20 mx-auto">
                                </div>
                                <p class="text-center">{{ state.game.awayName }}</p>
                                <p class="text-center" v-if="state.stats[state.game.awayName]">
                                    Win Rate: 
                                    {{ (state.stats[state.game.awayName].winRate * 100).toFixed(2) }}%
                                </p>
                            </div>

                        </div>

                        <div 
                            :class="[playerHasWon ? 'bg-green-500' : 'bg-red-800']"
                            class="flex cursor-wait grow w-full gap-5 p-2 text-white rounded justify-around items-center"
                            >
                            Votação encerrada! {{ playerHasWon ? 'Você venceu!' : '' }} {{ gameWinner === 'Empate' ? 'Aconteceu um empate.' : `O vencedor foi ${gameWinner}!` }}
                        </div>
                    </div>
                    
                    <KeepAlive>
                        <GameHistory :gameHistory="state.gameHistory" />
                    </KeepAlive>

                    <!-- <KeepAlive> -->
                        <GameProfile :shop="state.shop" :player="state.player" :game="state.game" />
                    <!-- </KeepAlive> -->
                </div>
            </div>

            <ClientOnly>
                <Teleport to="#teleports">
                    <!-- Teleport goes here -->
                </Teleport>
            </ClientOnly>
        </div>
    </div>  
    <VoteEffects :effects="ephemeralEffects" />
</template>