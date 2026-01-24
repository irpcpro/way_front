import "./MessageContext.css"
import {config} from "./../../config/globalConfig.jsx";
import {useState} from "react";

function MessageContext({message, user, setSeeImageAttachment}) {

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
                                    src={message.attachment.url}
                                    alt={message.attachment.name}
                                />
                            )
                        }
                        {message.context?? ' '}
                    </div>
                    <div className="message-det">
                        <div className="time">{message.created_at}</div>
                        <div className="state">
                            {/*<div className={`msg-status ${false && 'read'}`}></div>*/}

                            {/*<div className="circle-loading">*/}
                            {/*    <div className="circle"></div>*/}
                            {/*    <div className="circle"></div>*/}
                            {/*    <div className="circle"></div>*/}
                            {/*</div>*/}
                        </div>
                        <div className="clear"></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MessageContext;
