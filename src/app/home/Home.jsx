import './Home.css'
import {LayoutMainContext} from "../app-layout/LayoutMain.jsx";
import {LayoutContentContext} from "../app-layout/LayoutContent.jsx";
import {LayoutFooterContext} from "../app-layout/LayoutFooter.jsx";
import {LayoutHeaderContext} from "../app-layout/LayoutHeader.jsx";
import HeaderLogo from "../components/HeaderLogo.jsx";
import FooterNav from "../components/FooterNav.jsx";
import HomeSkeletonChats from "./HomeSkeletonChats.jsx";
import {useCallback, useEffect, useState} from "react";
import GetListMessagesApi from "../../api/GetListMessagesApi.jsx";
import toast from "react-hot-toast";
import HomeListMessages from "./HomeListMessages.jsx";
import ChatSubscriptionManager from "../Websocket/ChatSubscriptionManager.jsx";

function Home() {

    const [listMessages, setListMessages] = useState([]);
    const [listMessagesLoading, setListMessagesLoading] = useState(true);

    const getMessages = () => {
        GetListMessagesApi.getListMessages().then((response) => {
            console.log('response', response)
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
                <ChatSubscriptionManager
                    messages={listMessages}
                />
                {
                    !listMessagesLoading ? (
                        listMessages.length?(
                            listMessages.map((item) => (
                                <HomeListMessages item={item} />
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
