import WS from "./WebSocketService.jsx";
import {WebSocketAuthApi} from "./WebSocketAuthApi.jsx";
import toast from "react-hot-toast";
import {config} from "../../config/globalConfig.jsx";

/**
 * Subscribe to multiple chat hooks and listen to new messages
 */
export const subscribeMessageHooks = (hooks = [], onNewMessage, events = []) => {
    const socketID = WS.getSocketId();

    if(socketID !== undefined && socketID !== null) {
        console.log('do thiiiiiiiiiiiiiis', hooks)
        WebSocketAuthApi.authNewMessages(socketID, hooks).then((res)=>{
            res.data.forEach(item => {
                let subData = {
                    auth: item.auth,
                    channel: item.channel_name
                }
                WS.bind(
                    subData,
                    events,
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

export const subscribeUserHooks = (hook = null, onNewMessage = null, events = []) => {
    const socketID = WS.getSocketId();

    if(socketID !== undefined && socketID !== null && hook !== null) {
        WebSocketAuthApi.authUserChannel(socketID, hook).then((res)=>{
            // res.data.forEach(item => {
            let subData = {
                auth: res.data.auth,
                channel: res.data.channel_name
            }
            WS.bind(
                subData,
                events,
                (msg) => {
                    console.log("✅ message received on user channel:", msg);
                    onNewMessage?.(msg);
                }
            );
            // });
        }).catch(err=>{
            console.log('chat auth error:', err)
            toast.error('chat auth error')
        });
    }
};

export const WSSendEvent = (data, event) => {
    data.event = event;
    // data.data = JSON.stringify(data.data);
    WS.send(data);
};
