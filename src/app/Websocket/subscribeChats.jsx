// src/app/websocket/subscribeChats.jsx
import WS from "./WebSocketService.jsx";
import {WebSocketAuthApi} from "./WebSocketAuthApi.jsx";
import toast from "react-hot-toast";

/**
 * Subscribe to multiple chat hooks and listen to new messages
 */
export const subscribeMessageHooks = (hooks = [], onNewMessage) => {
    const socketID = WS.getSocketId();

    hooks.forEach(hook => {
        let dataAuth = WebSocketAuthApi.authNewMessages(socketID, [hook]);

        console.log('do auth for channel')
        dataAuth.then((res) => {
            let subData = {
                auth: res.data[0].auth,
                channel: res.data[0].channel_name
            }
            WS.bind(subData, "new_messages", (msg) => {
                console.log('✅ message received [msg]: ', msg);
                if (onNewMessage) onNewMessage(msg);
            })
            // WS.subscribe(subData);

        }).catch(err => {
            console.log('chat auth error:', err)
            toast.error('chat auth error')
        });

    });
};
