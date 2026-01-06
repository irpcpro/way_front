import { useState, useEffect } from "react";

const BackToBottomChatButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const container = document.querySelector(".chat-window");
        if (!container) return;

        const threshold = 800;

        const toggleVisibility = () => {
            const distanceFromBottom =
                container.scrollHeight -
                container.scrollTop -
                container.clientHeight;

            setVisible(distanceFromBottom > threshold);
        };

        container.addEventListener("scroll", toggleVisibility);
        toggleVisibility(); // چک اولیه

        return () => container.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToBottom = () => {
        const container = document.querySelector(".chat-window");
        if (!container) return;

        container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
        });
    };

    if (!visible) return null;

    return (
        <button
            onClick={scrollToBottom}
            className="back-to-bottom-btn"
            aria-label="Back to bottom"
        >
            <i className="bi bi-arrow-down"></i>
        </button>
    );
};

export default BackToBottomChatButton;
