<script setup>
const websocket = useWebsocket();

const click1 = useSound('/sounds/clickb1.mp3');
const click2 = useSound('/sounds/clickb2.mp3');
const click3 = useSound('/sounds/clickb3.mp3');
const click4 = useSound('/sounds/clickb4.mp3');
const click5 = useSound('/sounds/clickb5.mp3');
const click6 = useSound('/sounds/clickb6.mp3');
const click7 = useSound('/sounds/clickb7.mp3');

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

    // random one of the click sounds
    const random = Math.floor(Math.random() * 7) + 1;
    const sound = eval(`click${random}`);

    sound.play({ playbackRate: 1 });

    onCooldown.value = true;
    onAnimation.value = true;
    
    websocket.send('vote', {
        team: props.team
    });

    setTimeout(() => {
        onAnimation.value = false;
        sound.play({ playbackRate: 1.5 });

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
        class="p-4 transition-all ease-in-out duration-200 flex items-center select-none justify-center cursor-pointer aspect-square rounded-full button"
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