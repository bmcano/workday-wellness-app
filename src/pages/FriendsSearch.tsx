import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Friend } from "../types/Friend.tsx";
import UserSearchList from "../components/UserSearchList.tsx";

const FriendsSearch: React.FC = () => {

    const [userList, setUserList] = useState<Friend[]>([]);

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate);
        fetch(
            'http://localhost:3001/search_users', {
            method: "get",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setUserList(data)
            }).catch(err => console.log(err))
    }, [navigate]);

    return (
        <React.Fragment>
            <Navbar />
            <Typography component="h1" variant="h4" align="center" marginTop={4}>Find Friends</Typography>
            <UserSearchList userList={userList} />
        </React.Fragment>
    )
}

export default FriendsSearch;