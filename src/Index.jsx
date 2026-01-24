import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './app/components/PrivateRoute'; // ایمپورت کن
import { AuthProvider } from './app/context/AuthContext'; // ایمپورت کن
import './CssReset.css'
import './main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Home from "./app/home/Home.jsx";
import NotFound from "./app/not-found/NotFound.jsx";
import LoginPage from "./app/login/LoginPage.jsx";
import {config} from "./config/globalConfig";
import React, {useEffect} from "react";
import InstallAppPrompt from "./app/login/InstallAppPrompt.jsx";
import './i18n';
import MessagePage from "./app/message/MessagePage.jsx";
import {WebSocketProvider} from "./app/Websocket/WebSocketProvider.jsx";

const WebSocketWrapper = ({ children }) => {
    const getWebSocketUrl = () => {
        const baseUrl = config.websocket.url_app + config.websocket.app_key;
        return `${baseUrl}?protocol=7&client=js&version=7.0.6&flash=false`;
    };

    return (
        <WebSocketProvider
            url={getWebSocketUrl()}
            appKey={config.websocket.app_key}
            token={"way_app_key:22db383126aed83923978f8015c3639769df2cfb42b7a5b8745453596fafb3f1"}
            translationKey={"NotificationFeature.NotificationFeatureSocket"}
            clientId={config.websocket.app_id}
        >
            {children}
        </WebSocketProvider>
    );
};

function Index() {
    return (
        <AuthProvider>
            <InstallAppPrompt />
            <Routes>
                <Route path={config.routes.login} element={<LoginPage />} />

                <Route element={(
                    <WebSocketWrapper>
                        <PrivateRoute />
                    </WebSocketWrapper>
                )}>
                    <Route path={config.routes.home} element={<Home />} />
                    <Route path={`${config.routes.message}/:id`} element={<MessagePage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default Index;
