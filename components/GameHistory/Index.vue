<script setup>
// receive history as props
const props = defineProps({
    gameHistory: {
        required: true
    }
});
</script>

<template>
    <div v-if="props.gameHistory.length > 0" class="flex container bg-white py-1 w-full rounded scrollbar-hide overflow-auto">

        <!-- Grid scroll -->
        <div class="flex flex-shrink-0 gap-1 first:ml-1 last:mr-1">

            <GameHistoryItem v-for="game in gameHistory" :key="game.id" :game="game" />

        </div>
    </div>
</template>