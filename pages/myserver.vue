<script setup>

const ws = new WebSocket('ws://localhost:9502');

const connection = ref('pending');

ws.onopen = function() {
    console.log('Conectado!');
    connection.value = 'connected';
};

ws.onmessage = function(e) {
    console.log('Mensagem recebida: ' + e.data);
};

ws.onclose = function() {
    console.log('Desconectado!');
    connection.value = 'disconnected';
};

ws.onerror = function(err) {
    console.error('Erro:', err);
    connection.value = 'disconnected';
};

</script>

<template>
    <div>
        <div v-if="connection === 'disconnected'">Erro de conexão! Atualize a página.</div>
        <div v-else-if="connection === 'pending'">Conectando...</div>
        <div v-else>Conectado!</div>
    </div>  
</template>