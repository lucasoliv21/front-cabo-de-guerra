<script setup>
const props = defineProps({
    timeLeft: {
        required: true
    },
    timeTotal: {
        required: true
    },
    timeText: {
        required: true
    }
});

const currentPercentage = computed(() => {
    let percentage = (props.timeLeft / props.timeTotal) * 100;
    // percentage = Math.floor(percentage);
    return `width: ${percentage}%;`;
});
</script>

<template>
    <div class="bg-gray-100 relative transition-all duration-1000 ease-in-out w-full min-w-full min-h-6 flex">
        
        <p class="absolute top-1/2 left-1/2 text-center transform whitespace-nowrap -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold">
            {{ props.timeText }} {{ props.timeLeft }} segundo(s).
        </p>

        <div class="bg-gradient-to-r from-[#F7971E] to-[#FFD200] w-[50%] transition-all duration-1000 ease-in-out" :style="currentPercentage"></div>
    </div>
</template>
