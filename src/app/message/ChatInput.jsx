import "./ChatInput.css"
import React, {useEffect, useRef, useState} from "react";
import {config} from "../../config/globalConfig.jsx";
import SendMessageApi from "../../api/SendMessageApi.jsx";
import toast from "react-hot-toast";
import SpinnerLoading from "../components/Spinner.jsx";

function ChatInput ({onSendHandle, onTyping, MessageID, scrollChat}) {
    const [value, setValue] = useState('');
    const [activeSendBtn, setActiveSendBtn] = useState(false);
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [attachmentID, setAttachmentID] = useState(null);
    const [attachmentUploading, setAttachmentUploading] = useState(false);

    const handleChange = (e) => {
        const textarea = e.target;
        onTyping?.();
        setValue(textarea.value);

        setActiveSendBtn(textarea.value !== '');

        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight - 20, 100);
        textarea.style.height = `${newHeight}px`;
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMsg();
        }
    };

    const cancelAttachment = () => {
        setAttachmentID(null);
        setPreviewUrl(null);
    }

    const msgSentSuccessfully = () => {
        setAttachmentID(null);
        setPreviewUrl(null);
    }

    const sendMsg = () => {
        if(!activeSendBtn) return

        onSendHandle(value, attachmentID, msgSentSuccessfully, cancelAttachment)
        setActiveSendBtn(false);
        setValue('')
    }

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("attachment", file);

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setAttachmentUploading(true)
        setTimeout(() => {
            scrollChat();
        }, 100)

        await SendMessageApi.attachment(formData, MessageID).then((res) => {
            setAttachmentID(res.data.id_attachment);
        }).catch((err) => {
            toast.error(err.message ?? 'Server error')
            setPreviewUrl(null);
            setAttachmentID(null);
        }).finally(() => {
            setAttachmentUploading(false)
        });

        e.target.value = "";
    };

    return (
        <>
            {previewUrl && (
                <div className="image-preview-container">
                    <div onClick={cancelAttachment} className="cancel"></div>
                    {attachmentUploading && <div className="attachment-uploading"><SpinnerLoading /></div>}
                    <img src={previewUrl} className="image-preview" alt="Preview" />
                </div>
            )}
            <div className="bg-chat-text">
                <div className="text">
                    <textarea
                        className="chat-textarea"
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        style={{
                            overflowY: value.split('\n').length > 4 ? 'auto' : 'hidden',
                            minHeight: '24px',
                            height: '33px'
                        }}
                    />
                </div>
                <div className="btns">
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{display: "none"}}
                        accept="image/*,video/*,*/*"
                        onChange={handleFileChange}
                    />
                    <div onClick={handleAttachClick} className={`attach-btn`}></div>
                    <div onClick={sendMsg} className={`send-btn ${activeSendBtn && 'active'}`}></div>
                </div>
            </div>
        </>
    )
}

export default ChatInput;
