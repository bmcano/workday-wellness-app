import "../App.css";
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";

const Exercises: React.FC = () => {
    return (
        <React.Fragment>
            <Navbar />
            <h1>Test</h1>
        </React.Fragment>
    )
}

export default Exercises