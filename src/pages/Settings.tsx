import "../App.css";
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import { ReactComponent as PrivacyIcon } from "../static/images/finger-print-outline.svg"
import { ReactComponent as SupportIcon } from "../static/images/information-circle-outline.svg"
import { ReactComponent as FriendsIcon } from "../static/images/people-outline.svg"
import { ReactComponent as EditProfileIcon } from "../static/images/person-circle-outline.svg"
import { ReactComponent as ExercisesIcon } from "../static/images/walk-outline.svg"
import { ReactComponent as LifeStatsIcon } from "../static/images/bar-chart-outline.svg"

const Profile: React.FC = () => {

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate)
    }, [navigate])

    const handleClick = (link: string) => {
        navigate(link)
    }

    return (
        <React.Fragment>
            <Navbar />
            <div className="settings-container">
                <h1 className="settings-title">Settings</h1>
                <div className="settings-content">
                    <div className="settings-option">
                        <div className="icon profile"></div>
                        <EditProfileIcon />
                        <p>Edit Profile</p>
                    </div>
                    <div className="settings-option" onClick={() => handleClick("/profile/friends")}>
                        <div className="icon friends"></div>
                        <FriendsIcon />
                        <p>Manage Friends</p>
                    </div>
                    <div className="settings-option" onClick={() => handleClick("/exercises/edit")}>
                        <div className="icon exercises"></div>
                        <ExercisesIcon />
                        <p>Edit Exercises</p>
                    </div>
                    <div className="settings-option">
                        <div className="icon stats"></div>
                        <LifeStatsIcon />
                        <p>Lifetime Stats</p>
                    </div>
                    <div className="settings-option">
                        <div className="icon privacy"></div>
                        <PrivacyIcon />
                        <p>Privacy Settings</p>
                    </div>
                    <div className="settings-option">
                        <div className="icon support"></div>
                        <SupportIcon />
                        <p>Contact Support</p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Profile