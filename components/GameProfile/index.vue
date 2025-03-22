<script setup>
const props = defineProps({
    player: {
        required: true
    },
    game: {
        required: true
    }
});

const teamNameComputed = computed(() => {
    return props.player.currentTeam ? props.player.currentTeam : 'Sem time';
});
</script>


<template>
    <div class="flex bg-white flex-wrap rounded container p-2 flex-row gap-x-4 gap-y-2 items-center text-xs">
        <!-- <p class="bg-slate-300 py-0.5 px-2 rounded sm">ID: <strong>{{ props.player.id }}</strong></p> -->
        <p class="bg-slate-300 py-0.5 px-2 rounded sm">Nome: <strong>{{ props.player.name }}</strong></p>
        <p class="bg-slate-300 py-0.5 px-2 rounded sm">Vitórias: <strong>{{ props.player.wins }}</strong></p>
        <!-- <p class="bg-slate-300 py-0.5 px-2 rounded sm">Pontuação: <strong>{{ props.player.wins }}</strong></p> -->
        <p class="bg-gradient-to-b from-[#F7971E] to-[#FFD200] py-0.5 px-2 rounded sm">Time atual: <strong>{{ teamNameComputed }}</strong></p>
    </div>
</template>