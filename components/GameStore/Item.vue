<script setup>
const props = defineProps({
    shopItem: {
        required: true
    },
    playerPoints: {
        required: true
    }
});

const websocket = useWebsocket();

const buyItem = () => {
    websocket.send('buyItem', { id: props.shopItem.id });
}
</script>

<template>
    <div class="flex bg-gray-200 rounded flex-col gap-2 p-8 sm:flex-row items-center sm:gap-6 sm:py-4 ...">
        <div class="flex shrink items-center justify-center text-3xl font-bold bg-gray-100 w-16 md:w-26 md:h-26 h-16 rounded-full sm:mx-0 sm:shrink-0">
            <img v-if="shopItem.image.startsWith('http')" :src="shopItem.image"  class="w-16 h-16 rounded-full sm:w-26 sm:h-26" />
            <span v-else>{{ shopItem.image }}</span>
        </div>
        <div class="space-y-2 text-center sm:text-left">
            <div class="space-y-0.5">
                <p class="text-lg font-semibold text-black">{{ shopItem.name }}</p>
                <p class="font-medium text-gray-500">{{ shopItem.description }}</p>
            </div>
            <div class="text-sm md:w-fit cursor-pointer py-0.5 px-4 border-1 border-[#F7971E] hover:from-[#F7971E] hover:to-[#FFD200] rounded">
                Custo: <strong>{{ shopItem.price }} pontos</strong>
            </div>
            <button 
                @click="buyItem"
                :disabled="shopItem.purchased || props.playerPoints < shopItem.price"
                class="border-purple-200 disabled:bg-purple-900/30 disabled:text-white disabled:border-transparent border-2 px-4 py-0.5 cursor-pointer rounded-xl text-purple-600 hover:border-transparent hover:bg-purple-600 hover:text-white active:bg-purple-700">
                Comprar
            </button>
        </div>
    </div>
</template>