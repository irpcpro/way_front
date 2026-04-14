import "./Setting.css"
import {LayoutMainContext} from "../app-layout/LayoutMain.jsx";
import {LayoutHeaderContext} from "../app-layout/LayoutHeader.jsx";
import {LayoutContentContext} from "../app-layout/LayoutContent.jsx";
import {LayoutFooterContext} from "../app-layout/LayoutFooter.jsx";
import {config} from "../../config/globalConfig.jsx";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext.jsx";
import {getUser} from "../utils/storage.jsx";
import {useNavigate} from "react-router-dom";
import ArrowBack from "../components/ArrowBack.jsx";
import FooterNav from "../components/FooterNav.jsx";

function Setting() {
    const { logout } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentUser(getUser())
        console.log('getUser()', getUser())
    }, []);

    const handleLogout = () => {
        logout();
    }

    const handleEditProfile = () => {
        navigate(config.routes.edit_profile)
    }

    return (
        <LayoutMainContext>
            <LayoutHeaderContext>
                <div className="header-row">
                    <ArrowBack />
                    <div className="title">User Setting</div>
                </div>
            </LayoutHeaderContext>
            <LayoutContentContext>
                <div className="setting-avatar">
                    {currentUser && currentUser.avatar && currentUser.avatar.url && (<img src={currentUser.avatar.url} alt=""/>)}
                </div>
                <div className="setting-user-name">{currentUser && (currentUser.name?? 'Anonymous')}</div>
                <ul className="setting-unordered-list">
                    <h6 className="setting-small-title">SETTING</h6>
                    <li onClick={handleEditProfile}>Edit Profile</li>
                    <li onClick={handleLogout} className="setting-logout-link">Logout</li>
                </ul>
            </LayoutContentContext>
            <LayoutFooterContext>
                <div className="setting-footer">Copyright © 2026 | version:{config.app_version}</div>
                <FooterNav />
            </LayoutFooterContext>
        </LayoutMainContext>
    )
}

export default Setting;
