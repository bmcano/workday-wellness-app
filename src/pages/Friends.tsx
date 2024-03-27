import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import { Friend } from "../types/Friend.tsx";
import Typography from "@mui/material/Typography";
import UserSearchList from "../components/UserSearchList.tsx";
import { apiGet } from "../api/serverApiCalls.tsx";
import CardText from "../components/card/CardText.tsx";

const Friends: React.FC = () => {

    const [friendsList, setFriendsList] = useState<Friend[]>([]);

    const navigate = useNavigate();
    useEffect(() => {
        AuthorizedUser(navigate);
        apiGet("/friends_list")
            .then(data => {
                setFriendsList(data)
            })
            .catch(error => console.log(error));
    }, [navigate]);

    return (
        <React.Fragment>
            <Navbar />
            <UserSearchList userList={friendsList} />
        </React.Fragment>
    )
}

export default Friends