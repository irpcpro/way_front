import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Index from './Index.jsx'
import './CssReset.css'
import './main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import toast, { Toaster } from 'react-hot-toast'
import 'bootstrap-icons/font/bootstrap-icons.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Toaster
                position="top-center"
                containerStyle={{
                    zIndex: 999999999,
                }}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        fontFamily: 'Vazirmatn, sans-serif'
                    }
                }}
            />
            <Index />
        </BrowserRouter>
    </StrictMode>
)
