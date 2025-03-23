<script setup>
// receive history as props
const props = defineProps({
    gameHistory: {
        required: true
    }
});
</script>

<template>
    <div v-if="props.gameHistory.length > 0" class="flex container bg-white py-1 w-full overflow-x-scroll rounded scrollbar-hide">

        <!-- Grid scroll -->
        <div class="flex flex-shrink-0 overflow-visible gap-1 first:ml-1 last:mr-1">

            <!-- <GameHistoryTooltip v-for="game in gameHistory" :key="game.id" :game="game"> -->
                <GameHistoryItem v-for="game in gameHistory" :key="game.id" :game="game" />
            <!-- </GameHistoryTooltip> -->

        </div>
    </div>
</template>