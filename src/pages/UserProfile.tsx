import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ProfilePicture from "../components/ProfilePicture.tsx";
import { apiPost, apiGet } from "../api/serverApiCalls.tsx";
import DefaultProfile from "../components/DefaultProfile.tsx";
import Card from "../components/card/Card.tsx";
import bronzeFlameImage from "../static/assets/bronzeflame.png";
import silverFlameImage from "../static/assets/silverflame.png";
import goldFlameImage from "../static/assets/goldflame.png";
import bronzeBell from "../static/assets/bronzebell.png";
import silverBell from "../static/assets/silverbell.png";
import goldBell from "../static/assets/goldbell.png";




const UserProfile: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const [firstName, setFristName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isFriend, setIsFriend] = useState(false);
    const [buttonText, setButtonText] = useState("Add Friend");
    const [user_id, setUserId] = useState("");
    const [base64Image, setBase64Image] = useState("");
    const [privacySettings, setPrivacySettings] = useState({
        publicProfile: false // Default to false, assuming private until fetched

    });

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate);
        const jsonData = JSON.stringify({ _id: id}); //this id is only for the USER PROFILE, not the privacy settings, need to cross check the users email with the privacy database to obtain privacy information
        
        console.log("Extacted id" + jsonData);

        apiPost("/view_profile", jsonData)
            .then(res => res.json())
            .then(data => {
                
                const public_user = data.user;
                setFristName(public_user.first_name);
                setLastName(public_user.last_name);
                setBase64Image(public_user.profile_picture === "" ? DefaultProfile : public_user.profile_picture);
                const user = data.auth_user;
                setUserId(user._id);
                if (user.friends.includes(public_user.email)) {
                    setIsFriend(true);
                    setButtonText("Remove Friend");
                }
            }).catch(error => console.log(error));



        apiGet("/privacy")
            .then(data => {
                
                if (data.authorized && data.privacySettings) {
                    console.log('Privacy settings:', data.privacySettings); 
                    //map the privacy 
                } else {
                    console.log('Not authorized to fetch privacy settings or no settings available.');
                }
            })
            .catch(error => {
                console.log(error);
            });



        apiPost("/get_privacy", jsonData)
            .then(res => res.json())
            .then(data => {
            
                if (data.authorized && data.privacySettings) {
                    console.log('Privacy settings retrieved for user ID:', id);
                    console.log('Privacy Settings for viewed user:', data.privacySettings);
                } else {
                    console.log('Not authorized to fetch privacy settings or no settings available for user ID:', id);
                }
            })
            .catch(error => {
                console.error('Error fetching privacy settings for user ID:', id, error);
            });

    }, [navigate, id]);

    const handleOnClick = () => {
        var link = "";
        if (!isFriend) {
            link = "/add_friend";
        } else {
            link = "/remove_friend";
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
            .catch(error => console.log(error));
    }

    return (
        <React.Fragment>
            <Navbar />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Card>
                    <Typography component="h1" variant="h4" align="center" marginBottom={2}>{firstName} {lastName}'s Profile</Typography>
                    <ProfilePicture isUserProfile={false} base64Img={base64Image} isSmallScreen={false} />
                    <Button variant="contained" color="primary" fullWidth onClick={handleOnClick} sx={{ mt: 4 }}>
                        {buttonText}
                    </Button>
                </Card>
                <Card>
                    <img src={bronzeFlameImage} alt="Bronze Flame" style={{ margin: '10px' }} />
                    <img src={silverFlameImage} alt="Silver Flame" style={{ margin: '10px' }} />
                    <img src={goldFlameImage} alt="Gold Flame" style={{ margin: '10px' }} />
                    <img src={bronzeBell} alt="Bronze Bell" style={{ margin: '10px' }} />
                    <img src={silverBell} alt="Silver Bell" style={{ margin: '10px' }} />
                    <img src={goldBell} alt="Gold Bell" style={{ margin: '10px' }} />
                </Card>
            </Box>
        </React.Fragment>
    )
}

export default UserProfile;