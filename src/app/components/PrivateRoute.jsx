import React, {useContext, useEffect} from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx";
import {config} from "./../../config/globalConfig";
import SpinnerLoading from "./Spinner.jsx";
import {getUser} from "../utils/storage.jsx";
import toast from "react-hot-toast";
import {useWebSocketContext} from "../Websocket/WebSocketProvider.jsx";

const PrivateRoute = () => {
    const { isAuthenticated, loading, user} = useContext(AuthContext);
    const location = useLocation();
    const { subscribe, unsubscribe, isConnected } = useWebSocketContext();

    useEffect(() => {
        if (isAuthenticated && user && isConnected) {
            // این باید از backend گرفته شود یا محاسبه شود
            const userAuthToken = `way_app_key:${user.websocket_auth_token}`; // فرضی

            // Subscribe to user's private channel
            const userChannel = `private-user.${user.id}`;
            subscribe(userChannel, userAuthToken);

            // اگر در مسیر message هستیم، به message hook هم subscribe کنیم
            const pathParts = location.pathname.split('/');
            if (pathParts[1] === 'message' && pathParts[2]) {
                const messageHookId = pathParts[2];
                const messageHookChannel = `private-new_messages.id_message_hook.${messageHookId}`;

                // ساخت auth token برای message hook
                const messageHookAuthToken = `way_app_key:${user.message_hook_auth_token}`; // فرضی
                subscribe(messageHookChannel, messageHookAuthToken);

                // Cleanup برای message hook
                return () => {
                    unsubscribe(messageHookChannel);
                };
            }

            // Cleanup برای user channel
            return () => {
                unsubscribe(userChannel);
            };
        }
    }, [isAuthenticated, user, subscribe, unsubscribe, isConnected, location.pathname]);

    // هنوز AuthContext لود نشده → هیچ کاری نکن
    if (loading) {
        return (
            <div className="spinner-bg">
                <SpinnerLoading />
            </div>
        );
    }

    // if is not logged in
    if (!isAuthenticated) {
        return <Navigate to={config.routes.login} replace />;
    }

    // unless go to the page
    return <Outlet />;
};

export default PrivateRoute;