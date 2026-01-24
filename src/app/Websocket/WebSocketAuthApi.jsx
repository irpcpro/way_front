import AuthMessagesApi from "../../api/AuthMessagesApi.jsx";
import BroadcastAuthApi from "../../api/BroadcastAuthApi.jsx";

export const WebSocketAuthApi = {
    authNewMessages: (socketId, channelNames) => {
        channelNames = channelNames.map((item)=>
            "private-new_messages.id_message_hook." + item
        );

        return AuthMessagesApi.get({socket_id: socketId, channel_names: channelNames});
    },
    authUserChannel: (socketId, channelName) => BroadcastAuthApi.get({socket_id: socketId, channel_name: channelName}),
};
