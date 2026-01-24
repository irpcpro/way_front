// src/app/websocket/WebSocketService.jsx
import {config} from "../../config/globalConfig.jsx";

class WebSocketService {
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.channels = {};
        this.connected = false;
        this.socketId = null;
    }

    connect() {
        if (this.ws) return;

        let newUrl = this.url + config.websocket.app_key + "?protocol=7&client=js&version=7.0.6&flash=false";
        this.ws = new WebSocket(newUrl);

        this.ws.onopen = () => {
            this.connected = true;
            console.log("[WS] connected");
        };

        this.ws.onmessage = (e) => {
            // console.log('data received [msg from ws]: ', JSON.parse(JSON.parse(e.data).data).message);
            try {
                const data = JSON.parse(e.data);

                if (data.event === "pusher:connection_established") {
                    const parsed = JSON.parse(data.data);
                    this.socketId = parsed.socket_id;
                    console.log("[WS] socketId:", this.socketId);
                    return;
                }

                const { channel, event, payload } = data;
                if (this.channels[channel] && this.channels[channel][event]) {
                    this.channels[channel][event].forEach(cb => cb(JSON.parse(data.data)));
                }
            } catch (err) {
                console.error("[WS] parse error:", err);
            }
        };

        this.ws.onerror = (err) => {
            console.error("[WS] error:", err);
        };

        this.ws.onclose = () => {
            console.log("[WS] disconnected");
            this.connected = false;
            this.ws = null;
        };
    }

    subscribe(data) {
        console.log('add channel !')
        if (!this.channels[data.channel]) {
            console.log('channel added ! data = ', { event: "pusher:subscribe", data })
            this.channels[data.channel] = {};
            // notify server about subscription
            this.send({ event: "pusher:subscribe", data });
        }
    }

    bind(data, event, callback) {
        if (!this.channels[data.channel]) this.subscribe(data);
        if (!this.channels[data.channel][event]) this.channels[data.channel][event] = [];
        this.channels[data.channel][event].push(callback);
    }

    send(data) {
        if (this.ws && this.connected) {
            this.ws.send(JSON.stringify(data));
        }
    }

    unsubscribe(channel) {
        if (!this.channels[channel]) return;
        this.send({ action: "unsubscribe", channel });
        delete this.channels[channel];
    }

    getSocketId() {
        return this.socketId;
    }
}

export default new WebSocketService(config.websocket.url_app);
