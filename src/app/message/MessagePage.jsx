import "./MessagePage.css"
import {useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
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
import SendMessageApi from "../../api/SendMessageApi.jsx";
import {config} from "../../config/globalConfig.jsx";
import {subscribeMessageHooks, WSSendEvent} from "../websocket/subscribeChats.jsx";
import { v4 as uuid4 } from "uuid";
import WS from "../websocket/WebSocketService.jsx";
import {getUser} from "../utils/storage.jsx";
import ArrowBack from "../components/ArrowBack.jsx";

function MessagePage(callback, deps) {
    const MessageID = Number(useParams().id);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const [messageLoading, setMessageLoading] = useState(true);
    const [messageDetails, setMessageDetails] = useState(null);

    const listTextsRef = useRef(null);
    const prevScrollHeightRef = useRef(0);
    const prevScrollTopRef = useRef(0);

    const [seeImageAttachment, setSeeImageAttachment] = useState(null);

    const [userTyping, setUserTyping] = useState(null);
    const typingTimerRef = useRef(null);
    const lastTypingSentRef = useRef(0);

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        setCurrentUser(getUser())
    }, []);

    const scrollToBottomChat = () => {
        listTextsRef.current.scrollTo({
            top: listTextsRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }

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
                                ...response.data.chats,
                                ...prev.chats
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

    const onSendMessageHandle = (msg, attachmentID = null, callbackSuccess = null, callbackFailed = null) => {
        const clientId = uuid4();

        // پیام skeleton
        const optimisticMsg = {
            message: {
                client_id: clientId,
                context: msg,
                is_current_user: true
            },
            user: messageDetails.members[0],
            status: config.enum.message_status.sending
        };

        // اضافه کردن optimistic message
        setMessageDetails(prev => ({
            ...prev,
            chats: [...prev.chats, optimisticMsg]
        }));

        let messageType = attachmentID !== null
            ? config.enum.message_type.attachment
            : config.enum.message_type.text;

        let data = {
            context: msg,
            uuid: clientId,
            id_message_hook: MessageID,
            type: messageType,
            client_id: clientId,
        }

        if(attachmentID !== null)
            data.id_attachment = attachmentID;

        // ارسال پیام
        SendMessageApi.send(data).then(() => {
            callbackSuccess?.();
        }).catch(() => {
            // در صورت خطا وضعیت رو update کن
            setMessageDetails(prev => ({
                ...prev,
                chats: prev.chats.map(item =>
                    item.message.client_id === clientId
                        ? { ...item, status: config.enum.message_status.failed }
                        : item
                )
            }));
            callbackFailed?.()
        });
    };


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


    const onSocketNewMessage = (newMessage) => {
        setMessageDetails(prev => {
            if (!prev) return prev;

            setUserTyping(null);

            let updated = prev.chats.map(item => {
                if (item.message.client_id && newMessage.uuid === item.message.client_id) {
                    let FinalMsg = { ...newMessage, status: config.enum.message_status.sent };
                    FinalMsg.message.is_current_user = true;
                    return FinalMsg;
                }
                return item;
            });

            const exists = updated.some(item => item.message.id_message === newMessage.message.id_message);
            if (!exists) updated = [...updated, { ...newMessage, status: config.enum.message_status.sent }];

            updated.sort((a, b) => new Date(a.message.created_at) - new Date(b.message.created_at));

            return { ...prev, chats: updated };
        });

        // scroll to bottom
        if (listTextsRef.current) {
            listTextsRef.current.scrollTo({
                top: listTextsRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    const onSocketUserStartTyping = (newMessage) => {
        setUserTyping({
            id_message_hook: newMessage.id_message_hook,
            user_uuid: newMessage.user_uuid,
            name: newMessage.name,
        });
    }

    const onSocketUserEndTyping = (newMessage) => {
        setUserTyping(null);
    }

    const DoSub = useCallback(() => {
        if (!MessageID) return;

        let listEvents = [
            config.websocket.events.new_message,
            config.websocket.events.user_start_typing,
            config.websocket.events.user_end_typing
        ];
        subscribeMessageHooks([Number(MessageID)], onMessageReceiveMapper, listEvents);
    }, [MessageID]);

    useEffect(() => {
        return () => {
            setUserTyping(null);
            clearTimeout(typingTimerRef.current);
        };
    }, [MessageID]);

    useEffect(() => {
        DoSub()
    }, [MessageID]);

    const sendTypingSignal = () => {
        const now = Date.now();

        const packet = {
            channel: config.websocket.private_message_hook + MessageID,
            data: {
                id_message_hook: Number(MessageID),
                user_uuid: currentUser?.uuid ?? null,
                name: currentUser?.name ?? null,
            }
        };

        // ✅ throttle: هر time_send_typing فقط یک start
        if (
            !lastTypingSentRef.current ||
            now - lastTypingSentRef.current >= config.websocket.time_send_typing
        ) {
            WSSendEvent(packet, config.websocket.events.user_start_typing);
            lastTypingSentRef.current = now;
        }

        // ✅ idle: اگر تایپ قطع شد end بفرست
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
            WSSendEvent(packet, config.websocket.events.user_end_typing);
            lastTypingSentRef.current = null; // reset
        }, config.websocket.time_send_end_typing);
    };

    return (
        <LayoutMainContext>
            <LayoutHeaderContext>
                <div className="chat-detail" onClick={() =>{
                    listTextsRef.current.scrollTop = listTextsRef.current.scrollHeight;
                }}>
                    <ArrowBack />
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
                                        messageDetails?.chats.map((msg, index) =>
                                            <div key={msg.message.id_message} className="message-fade">
                                                <MessageContext
                                                    key={msg.id_message ?? msg.client_id?? index}
                                                    message={msg.message}
                                                    status={msg.status ?? null}
                                                    user={msg.user?? []}
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
                {userTyping !== null && (
                    <div className="someone-typing">
                        <div className="circle-loading">
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                        </div>
                        <div className="name">
                            {
                                userTyping.name
                                    ? userTyping.name + ' is typing ...'
                                    : 'typing ..'
                            }
                        </div>
                    </div>
                )}

                <ChatInput
                    onSendHandle={onSendMessageHandle}
                    onTyping={sendTypingSignal}
                    MessageID={MessageID}
                    scrollChat={scrollToBottomChat}
                />
            </LayoutFooterContext>
        </LayoutMainContext>
    );

}

export default MessagePage;
