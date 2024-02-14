import "../App.css";
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import messageSound from '../static/sounds/popcorn.mp3'

const Chat: React.FC = () => {

    const navigate = useNavigate()
    const audioRef = new Audio(messageSound);

    useEffect(() => {
        AuthorizedUser(navigate)
    }, [navigate])

    const handleClick = () => {
        audioRef.play();
    }

    return (
        <React.Fragment>
            <Navbar />
            <h1>Chat</h1>
            <button onClick={handleClick}>Sound test</button>
        </React.Fragment>
    )
}

export default Chat