<script setup>

const { $confetti } = useNuxtApp();

const connection = ref('pending');

const state = ref({
  game: {},
  stats: {}, 
});

// top 5 toggle
const top5 = ref(true);

// Confeti on home vote
watch(
    () => state.value.game.homeVotes,
    (newState, oldState) => {
        if (newState === oldState) {
            return;
        }

        if (state.value.game.status !== 'running') {
            return;
        }

        if (newState <= oldState) {
            return;
        }

        if (typeof oldState === 'undefined') {
            return;
        }

        console.log(`I did a confetti! ${newState} > ${oldState}`);

        const angle = Math.floor(Math.random() * 80) - 40;

        let confettiCount = 1
        
        if (newState % 1000 === 0) {
            confettiCount = 1000;
        } else if (newState % 100 === 0) {
            confettiCount = 100;
        } else if (newState % 10 === 0) {
            confettiCount = 10;
        }

        // confetti from left
        $confetti({
            particleCount: confettiCount,
            spread: 70,
            angle: angle,
            origin: { x: 0 },
            scalar: 2,
            shapes: ["image"],
            shapeOptions: {
                image: {
                    src: state.value.game.homeFlag,
                    replaceColor: true,
                    width: 32,
                    height: 40,
                },
            },
        });
    }
)

// Confeti on away vote
watch(
    () => state.value.game.awayVotes,
    (newState, oldState) => {
        if (newState === oldState) {
            return;
        }

        if (state.value.game.status !== 'running') {
            return;
        }

        if (newState <= oldState) {
            return;
        }

        if (typeof oldState === 'undefined') {
            return;
        }

        console.log(`I did a confetti because away votes increased from ${oldState} to ${newState}`);


        // angle between 140 and 220
        const angle = Math.floor(Math.random() * 80) + 140;

        let confettiCount = 1
        
        if (newState % 1000 === 0) {
            confettiCount = 1000;
        } else if (newState % 100 === 0) {
            confettiCount = 100;
        } else if (newState % 10 === 0) {
            confettiCount = 10;
        }

        // confetti from right
        $confetti({
            particleCount: confettiCount,
            spread: 70,
            angle: angle,
            scalar: 2,
            origin: { x: 1 },
            shapes: ["image"],
            shapeOptions: {
                image: {
                    src: state.value.game.awayFlag,
                    replaceColor: true,
                    width: 32,
                    height: 40,
                },
            },
        });
    }
)

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

// @TODO - Resolver essa gambiarra pro jogo ter acesos a ref websocket
const websocket = ref(null);

const vote = (team) => {
    websocket.value.send(`vote-${team}`);
};

const scoreboard = computed(() => {
  const entries = Object.entries(state.value.stats);
  
  entries.sort((a, b) => b[1].winRate - a[1].winRate);

  return entries.slice(0, 5).map(([teamName, stats]) => {
    return {
      teamName,
      winRate: stats.winRate,
      played: stats.played,
      won: stats.won,
    };
  });
});

onMounted(() => {

    const ws = new WebSocket('ws://localhost:9502');

    websocket.value = ws;

    ws.onopen = function() {
        console.log('Conectado!');
        connection.value = 'connected';

        ws.send('send-state');
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.game) {
        state.value.game = data.game;
      }
      if (data.stats) {
        state.value.stats = data.stats;
      }
    };

    ws.onclose = function() {
        console.log('Desconectado!');
        connection.value = 'disconnected';
    };

    ws.onerror = function(err) {
        console.error('Erro:', err);
        connection.value = 'disconnected';
    };
})

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

</script>

<template>
    <div>
        <div v-if="connection === 'disconnected'">
            <p class="absolute bg-red-500 top-5 left-5 rounded-md text-xs p-1 text-white uppercase font-bold select-none">
                Erro de conexão! Atualize a página.
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
                    <ul>
                        <li v-for="(item, index) in scoreboard" :key="index" class="text-sm px-2 py-0.5">
                            {{ index + 1 }}. {{ item.teamName }} - {{ (item.winRate * 100).toFixed(2) }}%
                        </li>
                    </ul>
                </div>
            </div>

            <p class="absolute bg-green-500 top-5 left-5 rounded-md text-xs p-1 text-white uppercase font-bold select-none">Conectado</p>

            <!-- Team showoff -->
            <div v-if="state.game.status === 'waiting'">
                <div class="flex flex-col justify-center items-center bg-gradient-to-b from-[#8B5A2B] via-[#A97142] to-[#5C4033] min-h-screen">
                    <div class="bg-white container items-center mx-2 p-2 gap-4 rounded flex flex-col">
                        <p class="font-bold text-4xl text-center">Próximo confronto:</p>
                        <div class="flex w-full gap-5 justify-around items-center">
                            
                            <!-- Home -->
                            <div class="w-1/3">
                                <img :src="state.game.homeFlag" alt="home" class="w-20 animate-pulse h-20 mx-auto">
                                <p class="text-center">{{ state.game.homeName }}</p>
                            </div>

                            <!-- VS -->
                             <p>vs.</p>


                            <!-- Away -->
                            <div class="w-1/3">
                                <img :src="state.game.awayFlag" alt="home" class="w-20 animate-pulse h-20 mx-auto">
                                <p class="text-center">{{ state.game.awayName }}</p>
                            </div>

                        </div>

                        <div class="flex cursor-wait grow w-full gap-5 p-2 bg-blue-800 text-white rounded justify-around items-center">
                            Votação inicia em breve...
                        </div>
                    </div>
                    
                    
                    <!-- <p>Os times que irão disputar são:</p>
                    <p>{{ state.homeName }}</p>
                    <p>{{ state.awayName }}</p> -->
                </div>
            </div>

            <!-- Voting -->
            <div v-if="state.game.status === 'running'">
                <div class="flex flex-col justify-center items-center bg-gradient-to-b from-[#4CAF50] via-[#388E3C] to-[#1B5E20] min-h-screen">
                    <div class="bg-white container items-center mx-2 p-2 gap-4 rounded flex flex-col">
                        <p class="font-bold text-center text-4xl">Vote no seu time favorito:</p>
                        <div class="flex w-full gap-5 justify-around items-center">
                            
                            <!-- Home -->
                            <div class="w-1/3">
                                <img :src="state.game.homeFlag" alt="home" class="w-20 animate-bounce h-20 mx-auto">
                                <p class="text-center">{{ state.game.homeName }}</p>
                            </div>

                            <!-- VS -->
                             <p>vs.</p>


                            <!-- Away -->
                            <div class="w-1/3">
                                <img :src="state.game.awayFlag" alt="home" class="w-20 animate-bounce h-20 mx-auto">
                                <p class="text-center">{{ state.game.awayName }}</p>
                            </div>

                        </div>

                        <div class="flex gap-5 justify-around items-center">
                            <button @click="vote('home')" :disabled="state.game.status !== 'running'" class="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white cursor-pointer p-2 rounded-md select-none">Vote {{ state.homeName }}</button>
                            <button @click="vote('away')" :disabled="state.game.status !== 'running'" class="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white cursor-pointer p-2 rounded-md select-none">Vote {{ state.awayName }}</button>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- Winner screen -->
            <div v-if="state.game.status === 'finished'">
                <div class="flex flex-col justify-center items-center bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#B8860B] min-h-screen">
                    <div class="bg-white container items-center mx-2 p-2 gap-4 rounded flex flex-col">
                        <p class="font-bold text-center text-4xl">Vencedor da Rodada</p>
                        <div class="flex w-full gap-5 justify-around items-center">
                            
                            <!-- Home -->
                            <div :class="{'bg-black/5 animate-pulse': gameWinner === state.game.homeName}" class="w-1/3 flex py-2 rounded-lg flex-col items-center">
                                <p class="text-7xl">{{ state.game.homeVotes }}</p>
                                <br>
                                <div class="relative">
                                    <img :src="state.game.homeFlag" alt="home" class="w-20 h-20 mx-auto">
                                    <img :class="{'animate-ping': gameWinner === state.game.homeName}" :src="state.game.homeFlag" alt="home" class="absolute top-0 left-0 w-20 h-20 mx-auto">
                                </div>
                                <p class="text-center">{{ state.game.homeName }}</p>
                                <p v-if="state.stats[state.game.homeName]">
                                    Win Rate: 
                                    {{ (state.stats[state.game.homeName].winRate * 100).toFixed(2) }}%
                                  </p>
                            </div>

                            <!-- VS -->
                             <p>vs.</p>


                            <!-- Away -->
                            <div :class="{'bg-black/5': gameWinner === state.game.awayName}" class="w-1/3 flex py-2 rounded-lg flex-col items-center">
                                <p class="text-7xl">{{ state.game.awayVotes }}</p>
                                <br>
                                <div class="relative">
                                    <img :src="state.game.awayFlag" alt="away" class="w-20 h-20 mx-auto">
                                    <img :class="{'animate-ping': gameWinner === state.game.awayName}" :src="state.game.awayFlag" alt="away-2" class="absolute top-0 left-0 w-20 h-20 mx-auto">
                                </div>
                                <p class="text-center">{{ state.game.awayName }}</p>
                                <p v-if="state.stats[state.game.awayName]">
                                    Win Rate: 
                                    {{ (state.stats[state.game.awayName].winRate * 100).toFixed(2) }}%
                                </p>
                            </div>

                        </div>

                        <div class="flex cursor-wait grow w-full gap-5 p-2 bg-red-800 text-white rounded justify-around items-center">
                            Votação encerrada! {{ gameWinner === 'Empate' ? 'Aconteceu um empate.' : `O vencedor foi ${gameWinner}!` }}
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- <p>Status: {{ gameStatus }}</p>
            <p>Time casa: {{ state.homeName }}</p>
            <p>Time visitante: {{ state.awayName }}</p>
            <p>{{ state.homeVotes }} x {{ state.awayVotes }}</p>
            <button @click="vote('home')" :disabled="state.status !== 'running'">Vote {{ state.homeName }}</button>
            <button @click="vote('away')" :disabled="state.status !== 'running'">Vote {{ state.awayName }}</button> -->
        </div>
    </div>  
</template>