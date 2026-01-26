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
import { subscribeMessageHooks } from "../websocket/subscribeChats.jsx";
import {config} from "../../config/globalConfig.jsx";

function Home() {
    const [listMessages, setListMessages] = useState([]);
    const [listMessagesLoading, setListMessagesLoading] = useState(true);
    const subscribedRef = useRef(false);

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
        console.log("[WS] new message in Home:", newMsg);

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

    const onMessageReceiveMapper = (newMsg) => {
        switch (newMsg.event) {
            case config.websocket.events.new_message:
                onSocketNewMessage(newMsg.data);
                break;
            // case config.websocket.events.user_start_typing:
            //     onSocketUserStartTyping(newMsg.data);
            //     break;
            // case config.websocket.events.user_end_typing:
            //     onSocketUserEndTyping(newMsg.data);
            //     break
        }
    }

    useEffect(() => {
        if (!listMessages.length) return;
        if (subscribedRef.current) return;

        subscribedRef.current = true;

        let listEvents = [
            config.websocket.events.new_message,
            config.websocket.events.user_start_typing,
            config.websocket.events.user_end_typing
        ];

        const hooks = listMessages.map(item => item.message.id_message_hook);

        subscribeMessageHooks(hooks, onMessageReceiveMapper, listEvents);
    }, [listMessages]);



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
                                <HomeListMessages key={item.message.id_message} item={item} />
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
