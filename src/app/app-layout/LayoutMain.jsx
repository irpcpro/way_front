import {createContext} from "react";
import './LayoutMain.css'

export const layoutMain = createContext();

export const LayoutMainContext = ({children}) => {
    return (
        <layoutMain.Provider value={{}}>
            <div id="main-wrapper">
                {children}
            </div>
        </layoutMain.Provider>
    )
}
