import '../App.css'
import React from 'react'
import logoImage from '../static/images/logo.png';

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="logo">
                <img src={logoImage} alt="logo"/>
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
                <a href="/profile">
                    <span role="img" aria-label="profile icon">
                        🧑‍💻 {/** same idea here, except it will be users profile picture */}
                    </span>
                    Profile
                </a>
            </div>
        </div>
    );
};

export default Navbar;