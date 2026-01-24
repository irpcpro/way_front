import './HomeSkeletonChats.css'

const HomeSkeletonChats = () => (
    <div className="s-chat-item">
        <div className="s-left">
            <div className="s-avatar"></div>
        </div>
        <div className="s-right">
            <div className="s-top">
                <div className="s-name"></div>
                <div className="s-date"></div>
            </div>
            <div className="s-bottom">
                <div className="s-chat"></div>
            </div>
        </div>
    </div>
)

export default HomeSkeletonChats;
