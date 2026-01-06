import { useNavigate } from "react-router-dom";

function BackButton() {
    const navigate = useNavigate();

    return (
        <div
            className="go-back"
            onClick={() => navigate(-1)}
        >
            <svg width="100" height="60" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
                <line x1="90" y1="30" x2="20" y2="30" stroke="black" stroke-width="4"/>
                <polyline points="40,10 20,30 40,50" fill="none" stroke="black" stroke-width="4"/>
            </svg>
            {/*<i className="bi bi-arrow-left-short"></i>*/}
        </div>
    );
}

export default BackButton;
