import React from "react";
import "../css/styles.css";
import { Link } from "react-router-dom";
//import LoginWin from "./LoginWin";

import { isActive } from "../components/common";
import DrawCanvas from "./DrawCanvas";
// <LoginWin/>

//<Link to="/Merchant">Merchant</Link>
//<Link to="/Rule">Rule</Link>

const RootWin = () => {
    return (
        <div>
            <h1 className="blueHeader">Welcome to Image Classifier</h1>
            <DrawCanvas />
        </div>
    );
};

export default RootWin;
