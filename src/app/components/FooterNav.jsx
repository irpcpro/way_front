import "./FooterNav.css"
import {useLocation, useNavigate} from "react-router-dom";
import {config} from "../../config/globalConfig.jsx";

const FooterNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const handleSearch = () => {
        navigate(config.routes.search)
    }

    const handleSetting = () => {
        navigate(config.routes.setting)
    }

    const handleHome = () => {
        navigate(config.routes.home)
    }

    return (
        <div className="footer-nav">
            <div onClick={handleSetting} className={`icon-nav setting ${isActive(config.routes.setting) ? 'selected' : ''}`}></div>
            <div onClick={handleHome} className={`icon-nav home ${isActive(config.routes.home) ? 'selected' : ''}`}></div>
            <div onClick={handleSearch} className={`icon-nav search ${isActive(config.routes.search) ? 'selected' : ''}`}></div>
        </div>
    )
}

export default FooterNav;
