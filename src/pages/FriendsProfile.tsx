import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const FriendsProfile: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    // TODO - add profile picture
    const [firstName, setFristName] = useState("");
    const [lastName, setLastName] = useState("");
    const [buttonText, setButtonText] = useState("Add Friend");

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate);
        const jsonData = JSON.stringify({ _id: id });
        fetch(
            'http://localhost:3001/view_profile', {
            method: "post",
            credentials: 'include',
            body: jsonData,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setFristName(data.first_name);
                setLastName(data.last_name);
                const user = data.auth_user;
                if (user.friends.includes(data.email)) {
                    setButtonText("Remove Friend");
                }
            }).catch(err => console.log(err))
        
    }, [navigate]);

    const handleOnClick = () => {
        if (buttonText === "Add Friend") {
            // add friend call
        } else {
            // remove friend call
        }
    }

    return (
        <React.Fragment>
            <Navbar />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="card">
                    <Typography component="h1" variant="h4" align="center">{firstName} {lastName}'s Profile</Typography>
                    {/* Profile picture */}
                    <Button variant="contained" color="primary" fullWidth onClick={handleOnClick} sx={{ mt: 4 }}>
                        {buttonText}
                    </Button>
                </div>
            </Box>
        </React.Fragment>
    )
}

export default FriendsProfile