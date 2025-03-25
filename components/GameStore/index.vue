<script setup>

const props = defineProps({
    shop: {
        required: true
    },
    points: {
        required: true
    }
});

const open = ref(false);
</script>

<template>
    <button @click="open = true" class="cursor-pointer flex items-center gap-2 font-bold bg-gradient-to-b from-[#56ab2f] to-[#a8e063] hover:from-[#448127] hover:to-[#698842] py-0.5 px-2 rounded sm text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>

        LOJA
    </button>

    <ClientOnly>
        <Teleport to="#teleports">
            <div v-show="open" class="fixed inset-0 bg-black/60 flex items-center justify-center">
                <div class="bg-white container rounded p-4">
                    <!-- Header -->
                    <div class="flex flex-row justify-between items-center">
                        <div class="flex flex-row items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                            <h2 class="text-lg font-bold">Loja</h2>
                        </div>
                        
                        <!-- Right side-->
                        <div class="flex flex-row items-center gap-2">
                            <div class="text-sm cursor-pointer p-1 bg-gradient-to-b from-[#F7971E] to-[#FFD200] hover:from-[#F7971E] hover:to-[#FFD200] rounded">
                                Pontos: <strong>{{ props.points }}</strong>
                            </div>
                            <button @click="open = false" class="cursor-pointer font-bold bg-gray-400 hover:bg-gray-600 py-0.5 px-2 rounded sm text-white">
                                X
                            </button>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="border-t border-gray-400 mt-4 h-100 md:h-auto overflow-y-scroll">
                        <!-- Itens -->
                        <div class="grid grid-cols-2 gap-4 mt-4">

                            <GameStoreItem v-for="item in props.shop" :key="item.id" :shopItem="item" />

                        </div>
                    </div>

                    <!-- <h2 class="text-lg font-bold">Loja</h2>
                    <p>Itens disponíveis</p>
                    <button @click="open = false" class="cursor-pointer font-bold bg-gradient-to-b from-[#56ab2f] to-[#a8e063] hover:from-[#448127] hover:to-[#698842] py-0.5 px-2 rounded sm text-white">
                        FECHAR
                    </button> -->
                </div>
            </div>
        </Teleport>
    </ClientOnly>
</template>
