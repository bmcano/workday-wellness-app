import "../App.css";
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import { ReactComponent as PrivacyIcon } from "../static/assets/finger-print-outline.svg" // @ts-ignore
import { ReactComponent as SupportIcon } from "../static/assets/information-circle-outline.svg" // @ts-ignore
import { ReactComponent as FriendsIcon } from "../static/assets/people-outline.svg" // @ts-ignore
import { ReactComponent as EditProfileIcon } from "../static/assets/person-circle-outline.svg" // @ts-ignore
import { ReactComponent as ExercisesIcon } from "../static/assets/walk-outline.svg" // @ts-ignore
import { ReactComponent as LifeStatsIcon } from "../static/assets/bar-chart-outline.svg"
import CardText from "../components/card/CardText.tsx"

const Profile: React.FC = () => {

    const navigate = useNavigate();
    useEffect(() => {
        AuthorizedUser(navigate)
    }, [navigate]);

    const handleClick = (link: string) => {
        // Note: we do not need to call getFullAppLink since it stacking on settings
        navigate(link);
    }

    return (
        <React.Fragment>
            <Navbar />
            <div className="settings-container">
                <div className="settings-content">
                    <div className="settings-option" onClick={() => handleClick("/profile/edit")}>
                        <div className="icon profile"></div>
                        <EditProfileIcon />
                        <p>Edit Profile</p>
                    </div>
                    <div className="settings-option" onClick={() => handleClick("/exercises/edit")}>
                        <div className="icon exercises"></div>
                        <ExercisesIcon />
                        <p>Edit Exercises</p>
                    </div>
                    <div className="settings-option" onClick={() => handleClick("/profile/friends")}>
                        <div className="icon friends"></div>
                        <FriendsIcon />
                        <p>Manage Friends</p>
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
                    <div className="settings-option" onClick={() => handleClick("/about")}>
                        <div className="icon support"></div>
                        <SupportIcon />
                        <p>About</p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Profile