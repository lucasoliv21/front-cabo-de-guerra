export const useWebsocket = defineStore('websocket', () => {
    /** @type {WebSocket} */
    const ws = ref(null);

    const env = useRuntimeConfig().public;

    const connect = (uri) => {
        ws.value = new WebSocket(`${env.wsUrl}/${uri}`);
    }

    const send = (type, payload) => {
        const message = {
            type: type,
            payload: payload,
        }

        ws.value.send(
            JSON.stringify(message)
        );
    }

    return {
        ws,
        connect,
        send,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useWebsocket, import.meta.hot));
}
