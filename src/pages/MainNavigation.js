import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isActive } from "../components/common";
//import classes from "./MainNavigation.css"
import "./MainNavigation.css";
import MainContext from "./MainContext";

const MainNavigation = ({ active }) => {
    const navigate = useNavigate();
    const ctx = React.useContext(MainContext);
    function Logout() {
        ctx.setActive1("0");
        localStorage.token = "";
        navigate("/login");
    }
    const UserName = () => {
        const name =
            "Hello, " +
            localStorage.getItem("first_name") +
            " " +
            localStorage.getItem("last_name");
        return <span className="navUserName2">{name}</span>;
    };
    return (
        <div>
            <header className="header">
                <nav className="nav">
                    <div className="navline">
                        <ul className="list">
                            <li>
                                <NavLink to="/"> Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/DoodleLocal">
                                    Doodle (Local)
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/DoodleServer">
                                    Doodle (Server)
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/CharacterLocal">
                                    Character (Local)
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/CharacterServer">
                                    Character (Server)
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default MainNavigation;
