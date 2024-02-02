import "../App.css";
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import { ReactComponent as PrivacyIcon } from "../static/images/finger-print-outline.svg"

const Profile: React.FC = () => {

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate)
    }, [navigate])

    return (
        <React.Fragment>
            <Navbar />
            <div className="settings-container">
                <h1 className="settings-title">Settings</h1>
                <div className="settings-content">
                    <div className="settings-option">
                        <div className="icon privacy"></div>
                        <PrivacyIcon />
                        <div>
                            <p>Privacy Settings</p>
                        </div>
                    </div>
                    <div className="settings-option">
                        <div className="icon support"></div>
                        <p>Contact Support</p>
                    </div>
                    <div className="settings-option">
                        <div className="icon friends"></div>
                        <p>Manage Friends</p>
                    </div>
                    <div className="settings-option">
                        <div className="icon profile"></div>
                        <p>Edit Profile</p>
                    </div>
                    <div className="settings-option">
                        <div className="icon exercises"></div>
                        <p>Edit Exercises</p>
                    </div>
                    <div className="settings-option">
                        <div className="icon stats"></div>
                        <p>Lifetime Stats</p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Profile