import "./ChatInput.css"
import {useRef, useState} from "react";
import {config} from "../../config/globalConfig.jsx";

function ChatInput ({onSendHandle, onTyping}) {
    const [value, setValue] = useState('');
    const [activeSendBtn, setActiveSendBtn] = useState(false);
    const fileInputRef = useRef(null);

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

    const sendMsg = () => {
        if(!activeSendBtn) return
        onSendHandle(value, config.enum.message_type.text)
        setActiveSendBtn(false);
        setValue('')
    }

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log('file',file)
        return;
        if (file) {
            onSendHandle(file, config.enum.message_type.attachment);
        }
        e.target.value = "";
    }

    return (
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
    )
}

export default ChatInput;
