<script setup>

const props = defineProps({
    game: {
        required: true
    }
});

</script>

<template>
    <!-- Grid item -->
    <div v-if="game.status === 'finished'" class="bg-slate-500 group-hover:rounded-b-none group-hover:bg-slate-700 cursor-pointer group-first:bg-slate-600 p-1 grow flex gap-2 text-sm items-center rounded">
        <img :src="game.homeFlag" :class="{'bg-white': game.homeVotes > game.awayVotes}" class="p-0.5 w-6 h-6 rounded" alt="team-home">
        <p>vs</p>
        <img :src="game.awayFlag" :class="{'bg-white': game.awayVotes > game.homeVotes}" class="p-0.5 w-6 h-6 rounded" alt="team-away">
    </div>
</template>