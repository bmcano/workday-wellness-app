import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import { Friend } from "../types/Friend.tsx";
import Typography from "@mui/material/Typography";
import UserSearchList from "../components/UserSearchList.tsx";

const Friends: React.FC = () => {

    const [friendsList, setFriendsList] = useState<Friend[]>([]);

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate);
        fetch(
            'http://localhost:3001/friends_list', {
            method: "get",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setFriendsList(data)
            }).catch(err => console.log(err))
    }, [navigate]);

    return (
        <React.Fragment>
            <Navbar />
            <Typography component="h1" variant="h4" align="center" marginTop={4}>Friends</Typography>
            <UserSearchList userList={friendsList} />
        </React.Fragment>
    )
}

export default Friends