import "./NewConversationPage.css"
import {LayoutMainContext} from "../app-layout/LayoutMain.jsx";
import {LayoutHeaderContext} from "../app-layout/LayoutHeader.jsx";
import {LayoutContentContext} from "../app-layout/LayoutContent.jsx";
import {LayoutFooterContext} from "../app-layout/LayoutFooter.jsx";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import SearchUserApi from "../../api/SearchUserApi.jsx";
import {SMessageName} from "../message/MessageSkeletons.jsx";
import toast from "react-hot-toast";
import SendMessageApi from "../../api/SendMessageApi.jsx";
import SpinnerLoading from "../components/Spinner.jsx";
import {config} from "../../config/globalConfig.jsx";

function NewConversationPage() {
    const navigate = useNavigate();

    const UserID = useParams().user_id;
    const [chatLoading, setChatLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [makeConversationLoading, setMakeConversationLoading] = useState(false);

    useEffect(()=>{
        if(UserID){
            setChatLoading(true)
            SearchUserApi.searchUser(UserID).then((res)=>{
                setUser(res.data);
            }).catch((err)=>{
                const msg = err.message || 'can not find user';
                toast.error(msg);
            }).finally(()=>{
                setChatLoading(false)
            });
        }
    },[UserID])

    const MakeConversationPage = () => {
        if(makeConversationLoading) return;

        setMakeConversationLoading(true)
        SendMessageApi.makeConversation(UserID).then((res)=>{
            navigate(config.routes.message + '/' + res.data.id_message_hook)
        }).catch((err)=>{
            const msg = err.message || 'error making conversation';
            toast.error(msg);
        }).finally(() => {
            setMakeConversationLoading(false)
        })
    }

    return (
        <LayoutMainContext>
            <LayoutHeaderContext>
                <div className="chat-detail">
                    <div className="arrow-back" onClick={() => navigate(-1)}></div>
                    <div className="bg-image">
                        <div className={`avatar ${chatLoading && 's-loading'}`}>
                            {(!chatLoading && user && user.avatar && user.avatar.url) && <img src={user.avatar.url} alt="avatar" />}
                        </div>
                    </div>
                    <div className="bg-name">
                        {!chatLoading && user ? user.name??'Unknown' : <SMessageName />}
                    </div>
                </div>
            </LayoutHeaderContext>
            <LayoutContentContext>
                <div className="chat-no-msg"></div>
            </LayoutContentContext>
            <LayoutFooterContext>
                <div className={`btn-make-conversation ${makeConversationLoading && "loading"}`} onClick={MakeConversationPage}>
                    {makeConversationLoading ? <SpinnerLoading /> : "Make Conversation"}
                </div>
            </LayoutFooterContext>
        </LayoutMainContext>
    )
}

export default NewConversationPage;
