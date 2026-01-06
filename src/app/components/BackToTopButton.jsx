import { useState, useEffect } from "react";

const BackToTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const container = document.querySelector(".bg-app");
        if (!container) return;

        const toggleVisibility = () => {
            if (container.scrollTop > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        container.addEventListener("scroll", toggleVisibility);
        return () => container.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        const container = document.querySelector(".bg-app");
        if (!container) return;

        container.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!visible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="back-to-top-btn"
        >
            <i className="bi bi-arrow-up"></i>
        </button>
    );
};

export default BackToTopButton;
