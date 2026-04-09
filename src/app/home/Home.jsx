import './Home.css'
import {LayoutMainContext} from "../app-layout/LayoutMain.jsx";
import {LayoutContentContext} from "../app-layout/LayoutContent.jsx";
import {LayoutFooterContext} from "../app-layout/LayoutFooter.jsx";
import {LayoutHeaderContext} from "../app-layout/LayoutHeader.jsx";
import HeaderLogo from "../components/HeaderLogo.jsx";
import FooterNav from "../components/FooterNav.jsx";
import HomeSkeletonChats from "./HomeSkeletonChats.jsx";
import {useCallback, useEffect, useRef, useState} from "react";
import GetListMessagesApi from "../../api/GetListMessagesApi.jsx";
import toast from "react-hot-toast";
import HomeListMessages from "./HomeListMessages.jsx";
import { subscribeMessageHooks, subscribeUserHooks } from "../websocket/subscribeChats.jsx";
import {config} from "../../config/globalConfig.jsx";
import {getUser} from "../utils/storage.jsx";

function Home() {
    const [listMessages, setListMessages] = useState([]);
    const [listMessagesLoading, setListMessagesLoading] = useState(true);
    const subscribedRef = useRef(false);
    const userChannelSubscribedRef = useRef(false);
    const [usersTyping, setUsersTyping] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        setCurrentUser(getUser())
    }, []);


    const listEventsNewMessage = [
        config.websocket.events.new_message,
        config.websocket.events.user_start_typing,
        config.websocket.events.user_end_typing
    ];

    let listEventsNewConversation = [
        config.websocket.events.new_conversations
    ];

    const getMessages = () => {
        GetListMessagesApi.getListMessages().then((response) => {
            setListMessages(response.data)
        }).catch((error) => {
            toast.error(error.message)
        }).finally(()=>{
            setListMessagesLoading(false)
        })
    }

    useEffect(() => {
        getMessages();
    }, []);

    const onSocketNewMessage = (newMsg) => {
        setUsersTyping(prev => [
            ...prev.filter(item => item.id_message_hook !== newMsg.message.id_message_hook),
        ]);

        setListMessages(prevList => {
            const filtered = prevList.filter(
                item => item.message.id_message_hook !== newMsg.message.id_message_hook
            );

            const newItem = {
                message: newMsg.message ?? newMsg,
                user: newMsg.user
            };

            return [newItem, ...filtered];
        });
    }

    const onSocketUserStartTyping = (message) => {
        setUsersTyping(prev => [
            ...prev,
            {
                id_message_hook: message.id_message_hook,
                user_uuid: message.user_uuid,
                name: message.name,
            }
        ]);
    }

    const onSocketUserEndTyping = (message) => {
        setUsersTyping(prev => [
            ...prev.filter(item => item.id_message_hook !== message.id_message_hook),
        ]);
    }

    const onMessageReceiveMapper = (newMsg) => {
        switch (newMsg.event) {
            case config.websocket.events.new_message:
                onSocketNewMessage(newMsg.data);
                break;
            case config.websocket.events.user_start_typing:
                onSocketUserStartTyping(newMsg.data);
                break;
            case config.websocket.events.user_end_typing:
                onSocketUserEndTyping(newMsg.data);
                break
        }
    }

    useEffect(() => {
        if (!listMessages.length) return;
        if (subscribedRef.current) return;

        subscribedRef.current = true;

        const hooks = listMessages.map(item => item.message.id_message_hook);

        subscribeMessageHooks(hooks, onMessageReceiveMapper, listEventsNewMessage);
    }, [listMessages]);


    const onSocketNewConversation = (newMsg) => {
        // add to chat lists
        onSocketNewMessage(newMsg);
        // subscribe single chat
        subscribeMessageHooks([newMsg.message.id_message_hook], onMessageReceiveMapper, listEventsNewMessage);
    }

    const onUserChannelReceiveMapper = (newMsg) => {
        switch (newMsg.event) {
            case config.websocket.events.new_conversations:
                onSocketNewConversation(newMsg.data);
                break;
        }
    }

    // subscribe to user broadcast
    useEffect(() => {
        if(!currentUser || !currentUser.uuid) return;
        if (userChannelSubscribedRef.current) return;

        userChannelSubscribedRef.current = true;

        subscribeUserHooks(currentUser.uuid, onUserChannelReceiveMapper, listEventsNewConversation);
    }, [currentUser]);


    const SkeletonLoading = () => (
        <>
            <HomeSkeletonChats />
            <HomeSkeletonChats />
            <HomeSkeletonChats />
            <HomeSkeletonChats />
        </>
    )

    return (
        <LayoutMainContext>
            <LayoutHeaderContext>
                <HeaderLogo />
            </LayoutHeaderContext>
            <LayoutContentContext>
                {
                    !listMessagesLoading ? (
                        listMessages.length?(
                            listMessages.map((item) => (
                                <HomeListMessages
                                    userTyping={usersTyping.find(usrTyp => usrTyp.id_message_hook === item.message?.id_message_hook)}
                                    key={item.message !== null? item.message?.id_message : ''}
                                    item={item}
                                />
                            ))
                        ):(
                            <>
                                <div className="make-conversation-text">Make a conversation</div>
                                <div className="make-conversation"></div>
                            </>
                        )
                    ):(
                        SkeletonLoading()
                    )
                }
            </LayoutContentContext>
            <LayoutFooterContext>
                <FooterNav />
            </LayoutFooterContext>
        </LayoutMainContext>
    );
}

export default Home
