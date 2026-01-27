import "./HomeListMessages.css"
import {config} from "../../config/globalConfig.jsx";
import {useNavigate} from "react-router-dom";

const HomeListMessages = ({item, userTyping = null}) => {
    const navigate = useNavigate();

    const seeMessage = () => {
        // navigate(config.routes.message, item.message.id_message)
        navigate(config.routes.message + '/' + item.message.id_message_hook)
    }

    console.log('userTypinguserTyping', userTyping)

    return (
        <div onClick={seeMessage} className="message-item">
            <div className="left">
                <div className="avatar">
                    {item.user.avatar && (<img src={item.user.avatar} alt=""/>)}
                </div>
            </div>
            <div className="right">
                <div className="top">
                    <div className="name">
                        {item.user.name}
                    </div>
                    <div className="date">
                        {item.message.created_at}
                    </div>
                </div>
                <div className="bottom">
                    <div className="message">
                        {
                            userTyping != null
                                ? (<div className="item-typing">{userTyping.name ? userTyping.name + ' is typing ...' : 'typing ..'}</div>)
                                : item.message.type === config.enum.message_type.text ? (
                                        item.message.context
                                    ) : (
                                        <>
                                            <div className="attachment-image-pic"></div>
                                            {item.message?.context !== null ? item.message.context : (<span className="colorly">Sent an attachment</span>)}
                                        </>
                                    )
                        }
                    </div>
                    {/*<div className="new-msg">*/}
                    {/*    <div className="num">3</div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )
}

export default HomeListMessages;
