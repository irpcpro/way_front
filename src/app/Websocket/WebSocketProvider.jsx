"use client";

import { createContext, useContext } from "react";
import { useWebSocket } from "./useWebSocket.jsx";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({
                                      children,
                                      url,
                                      appKey,
                                      token,
                                      translationKey,
                                      clientId
                                  }) => {
    const websocket = useWebSocket(
        url, // اینجا URL کامل می‌آید
        appKey,
        token,
        clientId
    );

    return (
        <WebSocketContext.Provider value={websocket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => {
    const ctx = useContext(WebSocketContext);
    if (!ctx) throw new Error("useWebSocketContext must be used within WebSocketProvider");
    return ctx;
};