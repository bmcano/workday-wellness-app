import "../App.css";
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate)
    }, [navigate])

    return (
        <React.Fragment>
            <Navbar />
            <h1>Profile</h1>
        </React.Fragment>
    )
}

export default Profile