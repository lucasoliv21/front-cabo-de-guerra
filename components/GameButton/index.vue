<script setup>
const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
    },
});
</script>

<template><!-- Duolingo stype button with tailwind css -->
    <button
        :class="[props.variant === 'primary' ? 'primary' : 'secondary']"
        class="p-2 flex items-center select-none justify-center cursor-pointer aspect-square rounded-full button"
        >
        <slot></slot>
    </button>
</template>

<style lang="css" scoped>
.primary {
    background-color: #58cc02;
    box-shadow: 0 5px 0 #58a700;
}

.secondary {
    background-color: #028fcc;
    box-shadow: 0 5px 0 #0054a7;
}

button:active {
    transform: translateY(5px);
    box-shadow: none;
}
</style>