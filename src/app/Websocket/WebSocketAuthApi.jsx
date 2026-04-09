import AuthMessagesApi from "../../api/AuthMessagesApi.jsx";
import BroadcastAuthApi from "../../api/BroadcastAuthApi.jsx";
import {config} from "../../config/globalConfig.jsx";
import AuthUserChannelApi from "../../api/AuthUserChannelApi.jsx";

export const WebSocketAuthApi = {
    authNewMessages: (socketId, channelNames) => {
        channelNames = channelNames.map((item)=>
            config.websocket.private_message_hook + item
        );
        return AuthMessagesApi.get({socket_id: socketId, channel_names: channelNames});
    },
    authUserChannel: (socketId, channelName) => {
        channelName = config.websocket.private_user_hook + channelName;
        console.log('channelName', channelName)
        return AuthUserChannelApi.get({socket_id: socketId, channel_name: channelName});
    },
};
