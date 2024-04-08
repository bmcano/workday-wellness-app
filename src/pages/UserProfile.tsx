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
// @ts-ignore
import bronzeFlameImage from "../static/assets/bronzeflame.png";
// @ts-ignore
import silverFlameImage from "../static/assets/silverflame.png";
// @ts-ignore
import goldFlameImage from "../static/assets/goldflame.png";
// @ts-ignore
import bronzeBell from "../static/assets/bronzebell.png";
// @ts-ignore
import silverBell from "../static/assets/silverbell.png";
// @ts-ignore
import goldBell from "../static/assets/goldbell.png";
// @ts-ignore
import linkedinicon from '../static/images/linkedin image.png';

const UserProfile: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const [firstName, setFristName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isFriend, setIsFriend] = useState(false);
    const [buttonText, setButtonText] = useState("Add Friend");
    const [user_id, setUserId] = useState("");
    const [base64Image, setBase64Image] = useState("");

    const [birthday, setBirthday] = useState("");
    const [about, setAbout] = useState("");
    const [linkedin, setLinkedin] = useState(null);

    interface PrivacySettings {
        publicProfile?: boolean;
        birthdayPrivate?: boolean;
        aboutPrivate?: boolean;
        linkedinLinkPrivate?: boolean;
        // ... any other privacy settings
    }

    const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate);
        const jsonData = JSON.stringify({ _id: id });

        apiPost("/view_profile", jsonData)
            .then(res => res.json())
            .then(data => {
                const public_user = data.user;
                setFristName(public_user.first_name);
                setLastName(public_user.last_name);
                setBase64Image(public_user.profile_picture === "" ? DefaultProfile : public_user.profile_picture);
                setBirthday(public_user.birthday);
                setAbout(public_user.about);
                setLinkedin(public_user.linkedIn_link);
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
                    setPrivacySettings(data.privacySettings);
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
            link = "/send_friend_request";
        } else {
            link = "/remove_friend";
        }
        const jsonData = JSON.stringify({ user_id: user_id, friend_id: id });
        apiPost(link, jsonData)
            .then(res => res.json())
            .then(data => {
                // TODO: will need to modify this to show proper text, and be able to revoke the request
                if (link === "/send_friend_request") {
                    setButtonText("Friend Request Sent");
                } else {
                    setIsFriend(false);
                    setButtonText("Add Friend");
                }
                alert("Friend request sent.");
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
                    {privacySettings?.birthdayPrivate ? (
                        <Typography component="p" variant="body1" align="center" marginBottom={2} marginTop={2}>
                            Birthday: {birthday}
                        </Typography>
                    ) : null}
                    {privacySettings?.aboutPrivate ? (
                        <Typography component="p" variant="body1" align="center" marginBottom={2} marginTop={2}>
                            {about}
                        </Typography>
                    ) : null}
                    {privacySettings?.linkedinLinkPrivate && linkedin ? (
                        <Box display="flex" justifyContent="center" alignItems="center" marginBottom={2} marginTop={2}>
                            <a href={linkedin} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={linkedinicon}
                                    alt="LinkedIn Profile"
                                    style={{
                                        cursor: 'pointer',
                                        height: '1em',
                                        width: 'auto'
                                    }}
                                />
                            </a>
                        </Box>
                    ) : null}

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