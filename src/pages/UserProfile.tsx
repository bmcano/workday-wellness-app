import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ProfilePicture from "../components/ProfilePicture.tsx";
import { apiPost } from "../api/serverApiCalls.tsx";
import DefaultProfile from "../components/DefaultProfile.tsx";

const UserProfile: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const [firstName, setFristName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isFriend, setIsFriend] = useState(false);
    const [buttonText, setButtonText] = useState("Add Friend");
    const [user_id, setUserId] = useState("");
    const [base64Image, setBase64Image] = useState("");

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate);
        const jsonData = JSON.stringify({ _id: id });
        apiPost('http://localhost:3001/view_profile', jsonData)
            .then(res => res.json())
            .then(data => {
                setFristName(data.first_name);
                setLastName(data.last_name);
                setBase64Image(data.profile_picture === "" ? DefaultProfile : data.profile_picture);
                const user = data.auth_user;
                setUserId(user._id);
                if (user.friends.includes(data.email)) {
                    setIsFriend(true);
                    setButtonText("Remove Friend");
                }
            }).catch(err => console.log(err));
    }, [navigate]);

    const handleOnClick = () => {
        var link = "";
        if (!isFriend) {
            link = 'http://localhost:3001/add_friend';
        } else {
            link = 'http://localhost:3001/remove_friend';
        }
        const jsonData = JSON.stringify({ user_id: user_id, friend_id: id });
        apiPost(link, jsonData)
            .then(res => res.json())
            .then(data => {
                if (data.isFriend) {
                    setIsFriend(true);
                    setButtonText("Remove Friend");
                } else {
                    setIsFriend(false);
                    setButtonText("Add Friend");
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <React.Fragment>
            <Navbar />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="card">
                    <Typography component="h1" variant="h4" align="center" marginBottom={2}>{firstName} {lastName}'s Profile</Typography>
                    <ProfilePicture isUserProfile={false} base64Img={base64Image} isSmallScreen={false} />
                    <Button variant="contained" color="primary" fullWidth onClick={handleOnClick} sx={{ mt: 4 }}>
                        {buttonText}
                    </Button>
                </div>
            </Box>
        </React.Fragment>
    )
}

export default UserProfile;