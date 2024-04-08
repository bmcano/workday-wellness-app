import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import { Friend } from "../types/Friend.tsx";
import UserSearchList from "../components/UserSearchList.tsx";
import { apiGet } from "../api/serverApiCalls.tsx";

const UserSearch: React.FC = () => {

    const [userList, setUserList] = useState<Friend[]>([]);

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate);
        apiGet("/users_list")
            .then(data => {
                setUserList(data)
            })
            .catch(error => console.log(error))
    }, [navigate]);

    return (
        <React.Fragment>
            <Navbar />
            <UserSearchList userList={userList} />
        </React.Fragment>
    )
}

export default UserSearch;