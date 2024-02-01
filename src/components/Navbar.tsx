import '../App.css';
import React, { useState } from 'react';
import logoImage from '../static/images/logo.png';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../api/Logout.tsx';

const Navbar = () => {

    const navigate = useNavigate();
    const [openSubMenu, setOpenSubMenu] = useState(false);
    const toggleSubMenu = () => {
        setOpenSubMenu(!openSubMenu);
    };

    const logout = () => {
        handleLogout(navigate)
    }

    return (
        <div className="navbar">
            <div className="logo">
                <img src={logoImage} alt="logo" />
            </div>
            <div className="nav-links">
                <a href="/">Home</a>
                <a href="/chat">Chat</a>
                <a href="/calendar">Calendar</a>
                <a href="/notifications">
                    <span role="img" aria-label="bell icon">
                        🔔 {/** will probably want a proper icon since we will need to have the little dot/number to show a user has a notificaiton */}
                    </span>
                    Notidication {/** likewise, this text might disappear later on*/}
                </a>
                <div className="subnav">
                    <a onClick={toggleSubMenu} role="button">
                        <span role="img" aria-label="profile icon">
                            🧑‍💻
                        </span>
                        Profile <i className="fa fa-caret-down"></i>
                    </a>
                    {openSubMenu && (
                        <div className="subnav-content">
                            <a href="/profile">Profile Settings</a>
                            <a href="/profile/friends">Friends</a>
                            <a href="#/" onClick={logout}>Logout</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;