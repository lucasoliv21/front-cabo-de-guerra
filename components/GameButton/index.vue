<script setup>
const websocket = useWebsocket();

const click = useSound('/sounds/clickb1.mp3');

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
    },
    team: {
        type: String,
        required: true,
    },
});

const onAnimation = ref(false);
const onCooldown = ref(false);

const voteHandle = (e) => {
    if (onCooldown.value) {
        e.preventDefault();
        return;
    };

    click.play({ playbackRate: 1 });

    onCooldown.value = true;
    onAnimation.value = true;
    
    websocket.send('vote', {
        team: props.team
    });

    setTimeout(() => {
        onAnimation.value = false;
        click.play({ playbackRate: 1.5 });

        setTimeout(() => {
            onCooldown.value = false;
        }, 200);
    }, 800);
};
</script>

<template>
    <button
        @click="voteHandle"
        :class="[
            props.variant === 'primary' ? 'primary' : 'secondary',
            onAnimation ? 'active' : '',
        ]"
        class="p-4 transition-all undraggable ease-in-out duration-200 flex items-center select-none justify-center cursor-pointer aspect-square rounded-full button"
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

.active {
    transform: translateY(5px);
    box-shadow: none;
}
</style>