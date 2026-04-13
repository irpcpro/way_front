import "./MessageContext.css"
import {config} from "./../../config/globalConfig.jsx";
import {useEffect, useState} from "react";

function MessageContext({message, user, setSeeImageAttachment, status}) {

    const [msgStatus, setMsgStatus] = useState(status);

    const renderStatusBar = () => {
        console.log('status =====', message, user, setSeeImageAttachment, status)
        switch (status) {
            case config.enum.message_status.sending:
                return (
                    <div className="circle-loading">
                        <div className="circle"></div>
                        <div className="circle"></div>
                        <div className="circle"></div>
                    </div>
                );
            case config.enum.message_status.sent: {
                if (message.is_current_user)
                    return <div className="msg-status"></div>
                else
                    return '';
            }
            case config.enum.message_status.failed:
                return <div className="msg-status failed-icon"></div>;
            default:
            {
                if (message.is_current_user)
                    return <div className="msg-status"></div>
                else
                    return '';
            }
        }
    }

    useEffect(() => {
        setMsgStatus(status)
    }, [status]);


    useEffect(() => {
        console.log('msgStatus ====', msgStatus, message.id_message)
    }, [msgStatus])

    return (
        <>

            <div className={`msg ${message.is_current_user && "me"}`}>
                <div className="bg-msg">
                    <div className="bg-text">
                        {
                            message.type === config.enum.message_type.attachment && (
                                <img
                                    onClick={()=>{setSeeImageAttachment(message)}}
                                    className="message-attachment"
                                    src={message.attachment?.url}
                                    alt={message.attachment?.name}
                                />
                            )
                        }
                        {message.context?? ' '}
                    </div>
                    <div className="message-det">
                        <div className="time">{message.created_at}</div>
                        <div className="state">
                            {/*<div className={`msg-status ${false && 'read'}`}></div>*/}

                            {renderStatusBar()}
                        </div>
                        <div className="clear"></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MessageContext;
