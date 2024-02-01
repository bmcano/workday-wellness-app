import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import { Friend } from "../context/Friend.tsx";
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";

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
            <div className="card">
                <ul className="card-list">
                    {friendsList.map((friend, index) => (
                        <><li key={index} className="card-item">
                            <div className="card-text">{`${friend.first_name} ${friend.last_name}`}</div>
                            <Button variant="contained" color="primary" onClick={() => navigate(`/profile/${friend.id}`)}>
                                View Profile
                            </Button>
                        </li>{index < friendsList.length - 1 && <div className="divider"></div>}</>
                    ))}
                </ul>
            </div>
        </React.Fragment>
    )
}

export default Friends