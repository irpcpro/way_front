import "./SearchListMessages.css"
import {config} from "../../config/globalConfig.jsx";
import {useNavigate} from "react-router-dom";

const SearchListMessages = ({item, userTyping = null}) => {
    const navigate = useNavigate();

    const seeMessage = () => {
        // navigate(config.routes.message, item.message.id_message)
        if(item.id_message_hook !== null){
            navigate(config.routes.message + '/' + item.id_message_hook)
        }else{
            navigate(config.routes.new_conversation + '/' + item.id_user)
        }
    }

    return (
        <div onClick={seeMessage} className="message-item">
            <div className="left">
                <div className="avatar">
                    {item.avatar && item.avatar.url && (<img src={item.avatar.url} alt=""/>)}
                </div>
            </div>
            <div className="right">
                <div className="top">
                    <div className="name">
                        {item.name} {item.username && (<>(@{item.username})</>)}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SearchListMessages;
