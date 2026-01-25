import "./ChatInput.css"
import {useState} from "react";

function ChatInput ({onSendHandle}) {
    const [value, setValue] = useState('');
    const [activeSendBtn, setActiveSendBtn] = useState(false);

    const handleChange = (e) => {
        const textarea = e.target;
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
        onSendHandle(value)
        setActiveSendBtn(false);
        setValue('')
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
                {/*<div className={`attach-btn`}></div>*/}
                <div onClick={sendMsg} className={`send-btn ${activeSendBtn && 'active'}`}></div>
            </div>
        </div>
    )
}

export default ChatInput;
