<script setup>

const connection = ref('pending');

const state = ref({});

onMounted(() => {
    const ws = new WebSocket('ws://localhost:9502');

    ws.onopen = function() {
        console.log('Conectado!');
        connection.value = 'connected';
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
        </div>
    </div>  
</template>