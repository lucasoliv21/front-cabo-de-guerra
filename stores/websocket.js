export const useWebsocket = defineStore('websocket', () => {
    /** @type {WebSocket} */
    const ws = ref(null);

    const connect = (url) => {
        ws.value = new WebSocket(url);
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
