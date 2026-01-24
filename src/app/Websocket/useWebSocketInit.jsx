import { useEffect } from "react";
import WebSocketService from "./WebSocketService";

export default function useWebSocketInit() {
    useEffect(() => {
        WebSocketService.connect();
    }, []);
}