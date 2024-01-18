import "../App.css";
import { Link } from 'react-router-dom'
import React from 'react';

const Home: React.FC = () => {

    return (
        <div>
            <h1>Home</h1>
            <Link to="/login">Login</Link>
            <Link to="/profile">Profile</Link>
        </div>
    )
}

export default Home