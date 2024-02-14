import "../App.css";
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // API FOR NOTIFICATIONS
import messageSound from '../static/sounds/popcorn.mp3'

const Notifications: React.FC = () => {

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate)
    }, [navigate])

    const audioRef = new Audio(messageSound);

    const showNotification = () => {
        toast.success('Hello, this is a notification!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        audioRef.play();
    };

    return (
        <React.Fragment>
            <Navbar />
            <h1>Notifications</h1>
            <button onClick={showNotification}>Show Notification</button>
            <ToastContainer />
        </React.Fragment>
    )
}

export default Notifications