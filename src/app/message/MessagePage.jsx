import "./MessagePage.css"
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import GetMessageDetailsApi from "../../api/GetMessageDetailsApi.jsx";
import toast from "react-hot-toast";
import {LayoutHeaderContext} from "../app-layout/LayoutHeader.jsx";
import {LayoutContentContext} from "../app-layout/LayoutContent.jsx";
import {LayoutFooterContext} from "../app-layout/LayoutFooter.jsx";
import {LayoutMainContext} from "../app-layout/LayoutMain.jsx";
import {SMessageName} from "./MessageSkeletons.jsx";
import ChatInput from "./ChatInput.jsx";
import SpinnerLoading from "../components/Spinner.jsx";
import MessageContext from "./MessageContext.jsx";
import {useWebSocketContext} from "../Websocket/WebSocketProvider.jsx";
import SendMessageApi from "../../api/SendMessageApi.jsx";
import {config} from "../../config/globalConfig.jsx";


function MessagePage() {
    const MessageID = useParams().id;
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const [messageLoading, setMessageLoading] = useState(true);
    const [messageDetails, setMessageDetails] = useState(null);

    const listTextsRef = useRef(null);
    const prevScrollHeightRef = useRef(0);
    const prevScrollTopRef = useRef(0);

    const [seeImageAttachment, setSeeImageAttachment] = useState(null);

    const { lastMessage } = useWebSocketContext();
    // const [messages, setMessages] = useState([]);
    // const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (lastMessage && lastMessage.event === 'new_message') {
            console.log('New message from WebSocket 11:', lastMessage.data);

            // // اضافه کردن پیام جدید به لیست
            // // ممکن است نیاز باشد بررسی کنید که پیام تکراری نباشد
            // setMessages(prev => {
            //     // بررسی تکراری نبودن پیام
            //     const isDuplicate = prev.some(item =>
            //         item.message?.id_message === lastMessage.data?.message?.id_message
            //     );
            //
            //     if (!isDuplicate) {
            //         return [lastMessage.data, ...prev];
            //     }
            //     return prev;
            // });
        }
    }, [lastMessage]);


    const loadMoreMessages = () => {
        if (!listTextsRef.current) return;

        const el = listTextsRef.current;

        prevScrollHeightRef.current = el.scrollHeight;
        prevScrollTopRef.current = el.scrollTop;

        setLoadingMore(true);
        setPage(prev => prev + 1);
    };

    useEffect(() => {
        if (MessageID) {
            if(page === 1)
            setMessageLoading(true);

            GetMessageDetailsApi.getMessageDetails(MessageID, page)
                .then((response) => {
                    if (page === 1) {
                        setMessageDetails(response.data);
                    } else {
                        setMessageDetails(prev => ({
                            ...response.data,
                            chats: [
                                ...response.data.chats, // پیام‌های قدیمی‌تر
                                ...prev.chats           // پیام‌های فعلی
                            ]
                        }));
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                })
                .finally(() => {
                    setMessageLoading(false);
                    setLoadingMore(false);
                });
        }
    }, [MessageID, page]);

    useEffect(() => {
        if (page === 1 && listTextsRef.current && messageDetails?.chats?.length > 0) {
            setTimeout(() => {
                listTextsRef.current.scrollTo({
                    top: listTextsRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, [messageDetails, page]);

    useLayoutEffect(() => {
        if (!loadingMore || !listTextsRef.current) return;

        const el = listTextsRef.current;
        const newScrollHeight = el.scrollHeight;
        const heightDiff = newScrollHeight - prevScrollHeightRef.current;

        el.scrollTop = prevScrollTopRef.current + heightDiff;
    }, [messageDetails]);

    const closeAttachment = () => {
        setSeeImageAttachment(null)
    }

    const onSendMessageHandle = (msg) => {
        let data = {
            'context': msg,
            'id_message_hook': MessageID,
            'type': config.enum.message_type.text
        }
        SendMessageApi.send(data).then((response) => {
            setMessageDetails(prev => ({
                ...prev,
                chats: [
                    ...prev.chats,
                    response.data
                ]
            }))
        }).catch((error) => {
            toast.error(error.message)
        })
    }

    return (
        <LayoutMainContext>
            <LayoutHeaderContext>
                <div className="chat-detail" onClick={() =>{
                    listTextsRef.current.scrollTop = listTextsRef.current.scrollHeight;
                }}>
                    <div className="arrow-back" onClick={() => navigate(-1)}></div>
                    <div className="bg-image">
                        <div className={`avatar ${messageLoading && 's-loading'}`}>
                            {(!messageLoading && messageDetails?.members[0].avatar) && <img src={messageDetails.members[0].avatar.url} alt="avatar" />}
                        </div>
                    </div>
                    <div className="bg-name">
                        {!messageLoading ? messageDetails?.members[0].name??'Unknown' : <SMessageName />}
                    </div>
                </div>
            </LayoutHeaderContext>
            <LayoutContentContext>
                {seeImageAttachment !== null && (
                    <>
                        <div className="icon-close-attachment" onClick={closeAttachment}><i className="bi bi-x-lg"></i></div>
                        <div onClick={closeAttachment} className="bg-dark-attachment"></div>
                        <div className="bg-see-image">
                            <img src={seeImageAttachment.attachment.url} alt=""/>
                            <a href={seeImageAttachment.attachment.url} download>
                                <div className="bi bi-download download-attachment"></div>
                            </a>
                        </div>
                        <div className="attachment-caption">
                            {seeImageAttachment.context}
                        </div>
                    </>
                )}

                {
                    !messageLoading
                        ? messageDetails?.chats.length > 0
                            ? (
                                <div className="list-texts" ref={listTextsRef}>
                                    {
                                        messageDetails?.has_more && (
                                            <button
                                                className="load-more-btn"
                                                disabled={loadingMore}
                                                onClick={loadMoreMessages}
                                            >
                                                {loadingMore ? 'Loading ..' : 'Load more messages'}
                                            </button>
                                        )
                                    }

                                    {
                                        messageDetails?.chats.map((msg) =>
                                            <div key={msg.message.id_message} className="message-fade">
                                                <MessageContext
                                                    message={msg.message}
                                                    user={msg.user}
                                                    setSeeImageAttachment={setSeeImageAttachment}
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                            )
                            : <div className="chat-no-msg"></div>
                        : <div className="chat-loading"><SpinnerLoading /></div>
                }
            </LayoutContentContext>
            <LayoutFooterContext>
                {/*<div className="someone-typing">*/}
                {/*    <div className="circle-loading">*/}
                {/*        <div className="circle"></div>*/}
                {/*        <div className="circle"></div>*/}
                {/*        <div className="circle"></div>*/}
                {/*    </div>*/}
                {/*    <div className="name">Alex is typing ..</div>*/}
                {/*</div>*/}

                <ChatInput onSendHandle={onSendMessageHandle} />
            </LayoutFooterContext>
        </LayoutMainContext>
    );

}

export default MessagePage;
