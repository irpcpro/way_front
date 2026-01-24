import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './app/components/PrivateRoute';
import { AuthProvider } from './app/context/AuthContext';
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
import useWebSocketInit from "./app/websocket/useWebSocketInit.jsx";

function Index() {
    useWebSocketInit();

    return (
        <AuthProvider>
            <InstallAppPrompt />
            <Routes>
                <Route path={config.routes.login} element={<LoginPage />} />

                <Route element={<PrivateRoute />}>
                    <Route path={config.routes.home} element={<Home />} />
                    <Route path={`${config.routes.message}/:id`} element={<MessagePage />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

export default Index;
