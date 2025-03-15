<script setup>
const props = defineProps({
    game: {
        required: true
    },
    fullWidth: {
        default: false
    }
});

const show = ref(false);

const dateTimeFromTimestamp = computed(() => {
    const date = new Date(props.game.createdAt * 1000);

    // Hours part from the timestamp
    const hours = date.getHours();

    // Minutes part from the timestamp
    const minutes = "0" + date.getMinutes();

    // Seconds part from the timestamp
    const seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format without substr
    const formattedTime = `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;

    return `${date.toLocaleDateString()} ${formattedTime}`;
});
</script>

<template>
    <div class="relative group" @mouseenter="show = true" @mouseleave="show = false">
        <slot></slot>
        <!-- bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 text-sm text-white bg-black rounded shadow-lg -->
        
        <div
            v-if="show"
            class="absolute flex flex-col gap-2 cursor-pointer text-slate-300 text-[10px] rounded-b bg-slate-500 md:bg-slate-400 group-hover:bg-slate-700 group-first:bg-slate-600 md:group-first:bg-slate-700 left-0 right-0 p-2"
            :class="{'max-w-[200px]': !props.fullWidth, 'w-64': props.fullWidth}"
        >
        <p><span class="font-bold">Time de casa:</span> {{ game.homeName }}</p>
        <p><span class="font-bold">Time visitante:</span> {{ game.awayName }}</p>
        <p><span class="font-bold">Placar:</span> {{ game.homeVotes }} x {{ game.awayVotes }}</p>
        <p><span class="font-bold">Data:</span> {{ dateTimeFromTimestamp }}</p>
        </div>
    </div>
</template>
