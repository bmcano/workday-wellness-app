import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Friend } from "../types/Friend.tsx";
import UserSearchList from "../components/UserSearchList.tsx";
import { apiGet } from "../api/serverApiCalls.tsx";
import { getServerCall } from "../util/getFullAppLink.ts";

const UserSearch: React.FC = () => {

    const [userList, setUserList] = useState<Friend[]>([]);

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate);
        apiGet(getServerCall("/users_list"))
            .then(res => res.json())
            .then(data => {
                setUserList(data)
            })
            .catch(err => console.log(err))
    }, [navigate]);

    return (
        <React.Fragment>
            <Navbar />
            <Typography component="h1" variant="h4" align="center" marginTop={4}>Find Friends</Typography>
            <UserSearchList userList={userList} />
        </React.Fragment>
    )
}

export default UserSearch;