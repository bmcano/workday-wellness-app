import '../App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleLogout } from '../api/Logout.tsx';
import ProfilePicture from './ProfilePicture.tsx';
// @ts-ignore
import { ReactComponent as HomeIcon } from "../static/assets/home-icon.svg"
// @ts-ignore
import { ReactComponent as ExerciseIcon } from "../static/assets/running-icon.svg"
// @ts-ignore
import { ReactComponent as CalendarIcon } from "../static/assets/calendar-icon.svg"
// @ts-ignore
import { ReactComponent as NotificationIcon } from "../static/assets/bell-icon.svg"
// @ts-ignore
import { ReactComponent as SFLogo } from "../static/assets/SFRED.svg"
// @ts-ignore
import { ReactComponent as LBLogo } from "../static/assets/leaderboard-star-svgrepo-com.svg"
import { getFullAppLink } from '../util/getFullAppLink.ts';
import Notifications from './Notifications.tsx';
import { apiGet } from '../api/serverApiCalls.tsx';

const Navbar = (props: { isLoading?: boolean } = { isLoading: false }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const [openSubMenu, setOpenSubMenu] = useState(false);
    const toggleSubMenu = () => {
        setOpenSubMenu(!openSubMenu);
    };

    const [openNotificationsDrawer, setOpenNotificationsDrawer] = useState(false);
    const toggleNotificationsDrawer = () => {
        setOpenNotificationsDrawer(!openNotificationsDrawer);
    };

    const logout = () => {
        handleLogout(navigate)
    }

    useEffect(() => {
        apiGet("/todays_events").catch(error => console.log(error));
        const intervalId = setInterval(() => {
            apiGet("/todays_events").catch(error => console.log(error));
        }, 1000 * 60); // checks events every minute to decide if a notification should be created

        return () => clearInterval(intervalId);
    }, [])

    return (
        <div className="navbar">
            <div className="logo-resize">
                <SFLogo />
            </div>
            <div className="nav-links">
                <a href={getFullAppLink("/")} className={location.pathname === '/' ? 'active-icon' : ''}><HomeIcon className="nav-icon" /></a>
                <a href={getFullAppLink("/exercises")} className={location.pathname === '/exercises' ? 'active-icon' : ''}><ExerciseIcon className="nav-icon" /></a>
                <a href={getFullAppLink("/calendar")} className={location.pathname === '/calendar' ? 'active-icon' : ''}><CalendarIcon className="nav-icon" /></a>
                <a href={getFullAppLink("/leaderboard")} className={location.pathname === '/leaderboard' ? 'active-icon' : ''}><LBLogo className="nav-icon" /></a>
                {/* eslint-disable-next-line */}
                <a onClick={toggleNotificationsDrawer} className={location.pathname === '/notifications' ? 'active-icon' : ''}><NotificationIcon className="nav-icon" /></a>
                {!props.isLoading &&
                    <div className="subnav">
                        {/* eslint-disable-next-line */}
                        <a onClick={toggleSubMenu} role="button">
                            <ProfilePicture isUserProfile={true} base64Img={""} isSmallScreen={true} />
                        </a>
                        {openSubMenu && (
                            <div className="subnav-content">
                                <a href={getFullAppLink("/profile")}>Profile</a>
                                <a href={getFullAppLink("/user/search")}>Find Friends</a>
                                <a href={getFullAppLink("/settings")}>Settings</a>
                                <a href={getFullAppLink("/login")} onClick={logout}>Logout</a>
                            </div>
                        )}
                    </div>
                }
            </div>
            {openNotificationsDrawer && <Notifications openDrawer={openNotificationsDrawer} />}
        </div>

    );
};

export default Navbar;