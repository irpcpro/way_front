// src/components/InstallAppPrompt.jsx
import React, { useState, useEffect } from "react";
import {
    SwipeableDrawer,
    Button,
    Typography,
    Box,
    Divider,
} from "@mui/material";
import "./InstallAppPrompt.css"

const InstallAppPrompt = () => {
    const [open, setOpen] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const hasDismissed = localStorage.getItem("installPromptDismissed");
        if (hasDismissed === "true") return;

        console.log('hasDismissed', hasDismissed)

        const handler = (e) => {
            e.preventDefault(); // جلوگیری از نمایش خودکار مرورگر
            setDeferredPrompt(e);
            setOpen(true); // باز کردن drawer خودمون
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstall = () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("user installed application");
            } else {
                console.log("user did npt install application");
            }
            setDeferredPrompt(null);
        });

        setOpen(false);
    };

    const handleDismiss = () => {
        localStorage.setItem("installPromptDismissed", "true");
        setOpen(false);
    };

    const closeDrawer = () => setOpen(false);

    return (
        <SwipeableDrawer
            anchor="bottom" // از پایین میاد بالا، مثل drawerهای مدرن
            open={open}
            onClose={closeDrawer}
            onOpen={() => setOpen(true)}
            PaperProps={{
                sx: {
                    width: "100%",
                    maxWidth: "500px",
                    margin: "0 auto",
                    borderRadius: "20px 20px 0 0",
                    zIndex: 9999996,
                },
            }}
        >
            <Box sx={{ p: 3, textAlign: "center" }}>
                {/* آیکون نصب */}
                <i style={{fontSize:"2rem"}} className="bi bi-file-arrow-down"></i>

                {/* عنوان */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    <span className="font-dana-light">Install Application</span>
                </Typography>

                {/* توضیحات */}
                <div style={{color: "#676767", fontSize:"0.9rem"}}>
                    <p className="font-dana-light">For having the best user experience, install the application</p>
                    <ul className="list-install-prompt">
                        <li>1) click the icon <i className="bi bi-three-dots-vertical"></i> next to url address bar</li>
                        <li>2) then click <span className="en-helper">Add to Home Screen</span>
                            <div className="icon-add-to-home"><i className="bi bi-display"><i className="bi bi-arrow-down-short"></i></i></div>
                            to install
                        </li>
                        <li>3) Then press "Install"</li>
                        <li>4) Then press "Add"</li>
                    </ul>
                </div>

                <Divider sx={{ my: 2 }} />

                {/* دکمه اصلی نصب */}
                <Button
                    variant="contained"
                    size="large"
                    className="btn-install-app"
                    fullWidth
                    onClick={handleInstall}
                    sx={{ mb: 2, borderRadius: 3, py: 1.5 }}
                    startIcon={<i style={{marginLeft:"10px", fontSize:"0.9rem"}} className="bi bi-download"></i>}
                >
                Install Application
                </Button>

                {/* دکمه بی‌خیال */}
                <Button
                    variant="text"
                    fullWidth
                    onClick={handleDismiss}
                    className="not-now"
                >
                    Not now
                </Button>
            </Box>
        </SwipeableDrawer>
    );
};

export default InstallAppPrompt;