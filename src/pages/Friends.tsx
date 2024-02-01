import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import { Friend } from "../types/Friend.tsx";
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const Friends: React.FC = () => {

    const [friendsList, setFriendsList] = useState<Friend[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

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

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredFriendsList = friendsList.filter((friend) =>
        `${friend.first_name} ${friend.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <React.Fragment>
            <Navbar />
            <Typography component="h1" variant="h4" align="center" marginTop={4}>Friends</Typography>
            <div className="box-card">
                <TextField label="Search" variant="outlined" value={searchTerm} onChange={handleSearch} fullWidth/>
            </div>
            <div className="card">
                <ul className="card-list">
                    {filteredFriendsList.map((friend, index) => (
                        <><li key={index} className="card-item">
                            <div className="card-text">{`${friend.first_name} ${friend.last_name}`}</div>
                            <Button variant="contained" color="primary" onClick={() => navigate(`/profile/friends/${friend.id}`)}>
                                View Profile
                            </Button>
                        </li>{index < filteredFriendsList.length - 1 && <div className="divider"></div>}</>
                    ))}
                </ul>
            </div>
        </React.Fragment>
    )
}

export default Friends