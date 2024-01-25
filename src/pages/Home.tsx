import "../App.css";
import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { handleLogout } from '../api/Logout.tsx';
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";

const Home: React.FC = () => {

    const navigate = useNavigate()
    const logout = () => {
        handleLogout(navigate)
    }

    useEffect(() => {
        AuthorizedUser(navigate)
    }, [navigate])

    return (
        <React.Fragment>
            <Navbar />
            <h1>Home</h1>
            <Link to="#/" onClick={logout}>Logout</Link>
        </React.Fragment>
    )
}

export default Home