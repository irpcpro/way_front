export const config = {
    "routes": {
        "home": "/",
        "my_badge": "/my-badge",
        "login": "/login",
        "floor_plan": "/map",
        "exhibitors": "/exhibitors",
        "products": "/products",
        "exhibitor": "/exhibitor",
        "product": "/product",
        "conferences": "/conferences",
        "interviews": "/interviews",
        "noorbakhsh": "/noorbakhsh",
        "interview": "/interview",
        "conference": "/conference",
        "speaker": "/speaker",
        "sponsors": "/sponsors",
        "profile": "/profile",
        "favorites": "/favorites",
        "artin_agent": "/artin-agent"
    },
    "post_types": {
        "exhibitor": "exhibitor",
        "product": "product",
        "conference": "conference",
        "speaker": "speaker"
    },
    "api_token": "authToken",
    "user_details": "user",
    "otp_len": Number(import.meta.env.VITE_OTP_LEN) || 4,
    "otp_timeout": Number(import.meta.env.VITE_OTP_TIMEOUT) || 120,
    "phone_len": 11,
    "phone_start_with": "09",
    "base_url": import.meta.env.VITE_API_BASE_URL,
    "conferences_status": {
        "ongoing": "ongoing",
        "not_started": "not_started",
        "finished": "finished"
    }
}
