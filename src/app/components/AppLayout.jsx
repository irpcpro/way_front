import NavigationBar from "./NavigationBar";
import BackButton from "./BackButton.jsx";


function AppLayout({ children }) {
    return (
        <div className="wrapper">
            <div className="home-container">
                <BackButton />
                <div className="bg-app">
                    {children}
                </div>
                <NavigationBar />
            </div>
        </div>
    );
}

export default AppLayout;
