import './Home.css'
import {useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';



function Home() {
    const navigate = useNavigate()
    const { t } = useTranslation();

    return (
        <div className="wrapper">
            <div className="home-container">

                <h1>{t('welcome')}</h1>

            </div>
        </div>
    );
}

export default Home
