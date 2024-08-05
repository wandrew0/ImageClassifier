import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppWithRecaptchaTest from "./pages/AppWithRecaptchaTest";
import {MainContextProvider} from "./pages/MainContext";


ReactDOM.render(
    <React.StrictMode>
        <MainContextProvider>

    <AppWithRecaptchaTest />
        </MainContextProvider>
    </React.StrictMode>,
    document.getElementById('root'));


