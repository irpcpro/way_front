import {useLocation, useNavigate} from "react-router-dom";
import {config} from "./../../config/globalConfig";

function NavigationBar(){
    const navigate = useNavigate()
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="bottom-nav">
            <div className={`nav-item ${isActive(config.routes.favorites) ? "active" : ""}`} onClick={() => navigate(config.routes.favorites)}>
                <i className="bi bi-heart"></i>
            </div>
            <div className={`nav-item ${isActive(config.routes.home) ? "active" : ""}`} onClick={() => navigate(config.routes.home)}>
                <i className="bi bi-house"></i>
            </div>
            <div className={`nav-item ${isActive(config.routes.profile) ? "active" : ""}`} onClick={() => navigate(config.routes.profile)}>
                <i className="bi bi-person"></i>
            </div>
        </div>
    );
}

export default NavigationBar;
