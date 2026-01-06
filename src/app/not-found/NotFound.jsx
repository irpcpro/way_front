import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css'; // اگه فایل جدا داری، یا استایل رو داخلش بذار

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
            <div className="notfound-content">
                {/* عدد بزرگ 404 */}
                <h1 className="notfound-title">404</h1>

                {/* پیام اصلی */}
                <h2 className="notfound-subtitle">اوپس! صفحه پیدا نشد</h2>

                <p className="notfound-text">
                    متأسفیم، صفحه‌ای که دنبالش هستید وجود ندارد یا منتقل شده.
                </p>

                {/* دکمه بازگشت به خانه */}
                <button
                    onClick={() => navigate('/')}
                    className="notfound-button"
                >
                    بازگشت به صفحه اصلی
                </button>

                {/* یا یه لینک ساده‌تر */}
                {/* <button onClick={() => navigate(-1)} className="notfound-button secondary">
          برگرد عقب
        </button> */}
            </div>

            {/* تزئینی پایین صفحه */}
            <div className="notfound-footer">
                <small>نمایشگاه نظام پرداخت © ۱۴۰۴</small>
            </div>
        </div>
    );
}

export default NotFound;