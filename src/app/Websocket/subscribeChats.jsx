import WS from "./WebSocketService.jsx";
import {WebSocketAuthApi} from "./WebSocketAuthApi.jsx";
import toast from "react-hot-toast";

/**
 * Subscribe to multiple chat hooks and listen to new messages
 */
export const subscribeMessageHooks = (hooks = [], onNewMessage) => {
    const socketID = WS.getSocketId();

    if(socketID !== undefined && socketID !== null) {
        WebSocketAuthApi.authNewMessages(socketID, hooks).then((res)=>{
            res.data.forEach(item => {
                let subData = {
                    auth: item.auth,
                    channel: item.channel_name
                }
                WS.bind(
                    subData,
                    "new_messages",
                    (msg) => {
                        console.log("✅ message received:", msg);
                        onNewMessage?.(msg);
                    }
                );
            });
        }).catch(err=>{
            console.log('chat auth error:', err)
            toast.error('chat auth error')
        });
    }

};