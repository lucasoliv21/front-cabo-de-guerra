<script setup>

const toggleModal = () => {
    alert('Abrir modal da loja');
}

const open = ref(false);
</script>

<template>
    <button @click="open = true" class="cursor-pointer font-bold bg-gradient-to-b from-[#56ab2f] to-[#a8e063] hover:from-[#448127] hover:to-[#698842] py-0.5 px-2 rounded sm text-white">
        LOJA
    </button>

    <Teleport to="body">
        <div v-show="open" class="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div class="bg-white rounded p-4">
                <h2 class="text-lg font-bold">Loja</h2>
                <p>Itens disponíveis</p>
                <button @click="open = false" class="cursor-pointer font-bold bg-gradient-to-b from-[#56ab2f] to-[#a8e063] hover:from-[#448127] hover:to-[#698842] py-0.5 px-2 rounded sm text-white">
                    FECHAR
                </button>
            </div>
        </div>
    </Teleport>
</template>
