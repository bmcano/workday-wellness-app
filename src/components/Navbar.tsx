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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = (props: { isLoading?: boolean } = { isLoading: false }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const [openSubMenu, setOpenSubMenu] = useState(false);
    const toggleSubMenu = () => setOpenSubMenu(!openSubMenu);
    const [openNotificationsDrawer, setOpenNotificationsDrawer] = useState(false);
    const toggleNotificationsDrawer = () => setOpenNotificationsDrawer(!openNotificationsDrawer);
    const [notificationCount, setNotificationCount] = useState(0);
    const logout = () => handleLogout(navigate);

    const showNotification = (count: number, plural: string) => {
        toast.info(`You have ${count} new notification${plural}.`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    useEffect(() => {
        // Goal:
        // Preemptive loading requires us to get the current notification count.
        // Then, in a 15 second intervals we pulse the events for today to see if one (past or present) show be notifying the user
        // Then we grab the notifications again and if the amount increased, from the previous check, we send a toast message.
        apiGet("/notifications")
            .then(data => {
                if (data.authorized) setNotificationCount(data.notifications.length);
            })
            .catch(error => console.log(error));

        const intervalId = setInterval(() => {
            apiGet("/todays_events").catch(error => console.log(error));
            apiGet("/notifications")
                .then(data => {
                    if (data.authorized) {
                        const count = data.notifications.length;
                        if (count > notificationCount) {
                            setNotificationCount(count);
                            showNotification(count, count > 1 ? "s" : "");
                        } else if (count < notificationCount) {
                            setNotificationCount(count);
                        }
                    }
                })
                .catch(error => console.log(error));
        }, 1000 * 15);
        return () => clearInterval(intervalId);
    }, [notificationCount])

    return (
        <div className="navbar">
            <div className="logo-resize">
                <SFLogo />
            </div>
            <ToastContainer />
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