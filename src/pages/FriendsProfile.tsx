import "../App.css";
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate, useParams } from "react-router-dom";

const FriendsProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate)
    }, [navigate]);

    return (
        <React.Fragment>
            <Navbar />
            <h1>{id}</h1>
        </React.Fragment>
    )
}

export default FriendsProfile