export const useWebsocket = defineStore('websocket', () => {
    const ws = ref({});

    const connect = (url) => {
        ws.value = new WebSocket(url);
    }

    return {
        ws,
        connect,
    };
});
