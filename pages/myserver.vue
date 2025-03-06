<script setup>

const ws = new WebSocket('ws://localhost:9502');

ws.onopen = function() {
    console.log('Conectado!');
};

ws.onmessage = function(e) {
    console.log('Mensagem recebida: ' + e.data);
};

ws.onclose = function() {
    console.log('Desconectado!');
};

ws.onerror = function(err) {
    console.error('Erro: ' + err);
};

</script>

<template>
    <div>
        Oi!
    </div>  
</template>