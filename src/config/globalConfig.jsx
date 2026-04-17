export const config = {
    "app_version": import.meta.env.VITE_APP_VERSION,
    "routes": {
        "home": "/",
        "search": "/search",
        "setting": "/setting",
        "edit_profile": "/edit_profile",
        "login": "/login",
        "message": "/message",
        "new_conversation": "/new_conversation",
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
        "private_user_hook": "private-user.",
        "events": {
            "new_message": "new_messages",
            "new_conversations": "new_conversations",
            "user_start_typing": "client-typing",
            "user_end_typing": "client-end-typing",
        },
        "time_send_typing": 7000,
        "time_send_end_typing": 10000,
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
        },
        "chat_type": {
            "private": 1,
            "group": 2,
        },
        "gender": {
            "man": "man",
            "woman": "woman",
        }
    }
}
