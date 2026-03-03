import "./FooterNav.css"
import {useNavigate} from "react-router-dom";
import {config} from "../../config/globalConfig.jsx";

const FooterNav = () => {
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate(config.routes.search)
    }

    return (
        <div className="footer-nav">
            <div className="icon-nav setting"></div>
            <div className="icon-nav add"></div>
            <div onClick={handleSearch} className="icon-nav search"></div>
        </div>
    )
}

export default FooterNav;
