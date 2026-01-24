// src/pages/Login/LoginPage.jsx
import React, {useState, useRef, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {AuthContext} from './../context/AuthContext';
import toast from 'react-hot-toast';
import './LoginPage.css';
import {config} from "../../config/globalConfig";
import authApi from "../../api/AuthApi.jsx";

function LoginPage() {
    const {login, isAuthenticated} = useContext(AuthContext);
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: شماره، 2: OTP
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(Array(config.otp_len).fill(''));
    const [loading, setLoading] = useState(false);

    const phoneInputRef = useRef(null);
    const otpInputsRef = useRef([]);
    const [inlineError, setInlineError] = useState('');
    const [timer, setTimer] = useState(0);

    const [loginLoading, setLoginLoading] = useState(true);

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        if (isAuthenticated) navigate('/');
        phoneInputRef.current?.focus();
    }, [isAuthenticated, navigate]);


    const showInlineError = (msg) => {
        setInlineError(msg);
        setTimeout(() => setInlineError(''), 4000);
    };

    const handleSendCode = async () => {
        if (loading) return;
        if (phone.length !== config.phone_len || !phone.startsWith(config.phone_start_with)) {
            toast.error('phone number is invalid');
            showInlineError(`length of phonenumber should be ${config.phone_len} and start with ${config.phone_start_with} number`);
            return;
        }

        setLoading(true);
        await authApi.sendOtp(phone).then((res) => {
            toast.success(res.message);
            setStep(2);
            setTimer(res.data.expires_in);
            setTimeout(() => otpInputsRef.current[0]?.focus(), 300);
        }).catch((err) => {
            toast.error('Server error')
            showInlineError('Error on Sending code');
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleLogin = async () => {
        if (loading) return;
        const otpValue = otp.join('');
        if (otpValue.length !== config.otp_len) {
            toast.error(`Please Enter the code [${config.otp_len} length]`);
            return;
        }

        setLoading(true);
        const res = await authApi.verifyOtp(phone, otpValue).then((res) => {
            const {token, user} = res.data;
            // set token to local storage
            toast.success('You are logged in');
            login(token, user);
            navigate('/');
        }).catch((err) => {
            const msg = err.message || 'wrong OTP code';
            toast.error(msg);
            showInlineError(msg);
            setTimeout(() => otpInputsRef.current[config.otp_len-1]?.focus(), 100);
        }).finally(() => {
            setLoading(false);
        });
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 11);
        setPhone(value);
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // go to the next field
        if (value && index < config.otp_len - 1) {
            otpInputsRef.current[index + 1]?.focus();
        }
    };

    useEffect(() => {
        // auto send login request
        if (otp.join('').length === config.otp_len) {
            handleLogin();
        }
    }, [otp])

    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (otp[index] !== '') {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                otpInputsRef.current[index - 1]?.focus();
            }
        }
    };

    const editPhone = () => {
        setStep(1);
        setOtp(['', '', '', '', '', '']);
        setTimer(0);
        setTimeout(() => phoneInputRef.current?.focus(), 100);
    };

    const isPhoneValid = phone.length === config.phone_len && phone.startsWith(config.phone_start_with);
    const isOtpComplete = otp.join('').length === config.otp_len;

    // auto send otp when mobile completed
    useEffect(() => {
        if (isPhoneValid && step === 1) {
            handleSendCode();
        }
        if (phone.length === config.phone_len && !phone.startsWith(config.phone_start_with)) {
            toast.error(`length of phonenumber should be ${config.phone_len} and start with ${config.phone_start_with} number`);
            showInlineError(`length of phonenumber should be ${config.phone_len} and start with ${config.phone_start_with} number`);
        }
    }, [phone]);

    useEffect(() => {
        if (!('OTPCredential' in window)) return;
        if (step !== 2) return;

        navigator.credentials.get({
            otp: { transport: ['sms'] },
            signal: new AbortController().signal,
        }).then(otpCredential => {
            if (!otpCredential) return;

            const code = otpCredential.code;

            if (code && code.length === config.otp_len) {
                setOtp(code.split(''));
            }
        }).catch(() => {});
    }, [step]);

    useEffect(() => {
        setTimeout(()=>{
            setLoginLoading(false);
        },900)
    }, []);

    return (
        <div className="bg-box-login min-vh-100 bg-login-color bg-gradient d-flex align-items-center justify-content-center p-2">
            {loginLoading && (
                <div className="login-loading">
                    <div className="img-way">
                        <div className="img">
                            <img src="../../../public/assets/images/where-are-you.svg" alt=""/>
                            <div className="progressbar"><div className="bar"></div></div>
                        </div>
                    </div>
                </div>
            )}
            <div className="copyright">All rights reserved | Copyright © 2026</div>
            <div className="bg-login-logo">
                <div className="login-logo"></div>
                <div className="login-logo-text"></div>
            </div>
            <div className="bg-white rounded-4 shadow-lg bg-white-box p-2" style={{maxWidth: '480px', width: '100%'}}>
                <div className="text-center pt-3">
                    <p className="text-muted">Enter your phone to send OTP via SMS</p>
                </div>
                {step === 1 ? (
                    <div>
                        <div className="mb-3">
                            <div className="input-group dir-left">
                                <input
                                    ref={phoneInputRef}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className="text-center login-phonenumber font-num"
                                    placeholder={`${config.phone_start_with}xxxxxxxxx`}
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    dir="ltr"
                                    autoComplete="off"
                                    disabled={loading}
                                    style={{
                                        fontSize: '20px',
                                        letterSpacing: '4px',
                                        fontVariantNumeric: 'tabular-nums'
                                    }}
                                />
                            </div>
                            {inlineError && (
                                <div className="text-danger text-alert mt-2 fw-bold" style={{fontSize: '14px'}}>
                                    {inlineError}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSendCode}
                            disabled={!isPhoneValid || loading}
                            className={`btn-send-login w-100 py-3 fw-bold ${(!isPhoneValid || loading) && 'btn-disabled'}`}
                        >
                            {loading ? 'Sending...' : 'Send Code'}
                        </button>
                    </div>
                ) : (
                    <div>
                    <div className="text-center mb-4">
                            <p className="text-muted mb-1">
                                OTP code was sent to:
                            </p>
                            <div>
                                <strong dir="ltr" className="font-num text-primary dir-left">{phone}</strong>
                            </div>
                            <button onClick={editPhone} className="btn btn-link text-decoration-underline p-0 ms-2">
                                Edit PhoneNumber
                            </button>
                        </div>

                        <div className="d-flex justify-content-center gap-3 mb-4 ltr">
                            {Array.from({length: config.otp_len}, (_, i) => (
                                <input
                                    key={i}
                                    ref={el => otpInputsRef.current[i] = el}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength="1"
                                    value={otp[i] || ''}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                                    className="form-control text-center fw-bold font-num"
                                    style={{
                                        width: '50px',
                                        height: '56px',
                                        fontSize: '22px',
                                        padding: '5px',
                                        borderRadius: '16px',
                                        border: '2px solid #e9ecef',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                        transition: 'all 0.2s'
                                    }}
                                    disabled={loading}
                                    autoComplete="off"
                                />
                            ))}
                        </div>

                        <div className="text-center mb-3">
                            {timer > 0 ? (
                                <span className="text-muted">
                                    Send again untill <strong className="font-num mx-2 text-primary">{timer}</strong> seconds.
                                </span>
                            ) : (
                                <button
                                    className="btn btn-link text-primary fw-bold p-0"
                                    onClick={handleSendCode}
                                    disabled={loading}
                                >
                                    Send again
                                </button>
                            )}
                        </div>

                        {inlineError && (
                            <div className="text-danger text-center mb-3 fw-bold" style={{fontSize: '14px'}}>
                                {inlineError}
                            </div>
                        )}

                        <button
                            onClick={handleLogin}
                            disabled={!isOtpComplete || loading}
                            className={`btn w-100 py-3 fw-bold ${isOtpComplete && !loading ? 'btn-success' : 'btn-secondary'}`}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginPage;