<script setup>

const connection = ref('pending');

const state = ref({});

// @TODO - Resolver essa gambiarra pro jogo ter acesos a ref websocket
const websocket = ref(null);

const vote = (team) => {
    websocket.value.send(`vote-${team}`);
};

onMounted(() => {
    const ws = new WebSocket('ws://localhost:9502');

    websocket.value = ws;

    ws.onopen = function() {
        console.log('Conectado!');
        connection.value = 'connected';

        ws.send('send-state');
    };

    ws.onmessage = function(e) {
        // console.log('Mensagem recebida: ' + e.data);
        state.value = JSON.parse(e.data);
        console.log(state.value);
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

</script>

<template>
    <div>
        <div v-if="connection === 'disconnected'"><p>Erro de conexão! Atualize a página.</p></div>
        <div v-else-if="connection === 'pending'"><p>Conectando...</p></div>

        <!-- Conectado -->
        <div v-else>
            <p>Conectado!</p>
            <p>Time casa: {{ state.homeName }}</p>
            <p>Time visitante: {{ state.awayName }}</p>
            <p>{{ state.homeVotes }} x {{ state.awayVotes }}</p>
            <button @click="vote('home')" :disabled="state.status !== 'running'">Vote {{ state.homeName }}</button>
            <button @click="vote('away')" :disabled="state.status !== 'running'">Vote {{ state.awayName }}</button>
        </div>
    </div>  
</template>