export const config = {
    "routes": {
        "home": "/",
        "login": "/login",
        "message": "/message",
    },
    "api_token": "authToken",
    "user_details": "user",
    "otp_len": Number(import.meta.env.VITE_OTP_LEN) || 4,
    "otp_timeout": Number(import.meta.env.VITE_OTP_TIMEOUT) || 90,
    "phone_len": 11,
    "phone_start_with": "09",
    "base_url": import.meta.env.VITE_API_BASE_URL,
    "websocket": {
        "url": import.meta.env.VITE_WEBSOCKET_URL,
        "url_app": import.meta.env.VITE_WEBSOCKET_URL + 'app/',
        "app_key": "way_app_key",
        "app_id": "way_app_id",
        "private_message_hook": "private-new_messages.id_message_hook.",
        "events": {
            "new_message": "new_messages",
            "user_start_typing": "client-typing",
            "user_end_typing": "client-end-typing"
        }
    },
    "enum": {
        "message_type": {
            "text": 1,
            "attachment": 2
        },
        "message_status": {
            "sending": "sending",
            "failed": "failed",
            "sent": "sent"
        }
    }
}
