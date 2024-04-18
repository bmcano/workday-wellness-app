import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ProfilePicture from "../components/ProfilePicture.tsx";
import { apiPost } from "../api/serverApiCalls.tsx";
import DefaultProfile from "../components/DefaultProfile.tsx";
import Card from "../components/card/Card.tsx";
import Badges from "../components/Badges.tsx";
import Divider from "../components/card/Divider.tsx";
import CardText from "../components/card/CardText.tsx";

const UserProfile: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const [firstName, setFristName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isFriend, setIsFriend] = useState(false);
    const [friendRequestSent, setFriendRequestSent] = useState(false);
    const [buttonText, setButtonText] = useState("Add Friend");
    const [user_id, setUserId] = useState("");
    const [base64Image, setBase64Image] = useState("");
    const [birthday, setBirthday] = useState("");
    const [about, setAbout] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [achievements, setAchievements] = useState({
        MadeFriend: false,
        OneDayStreak: false,
        TenDayStreak: false,
        HundredDayStreak: false,
        OneDayEx: false,
        TenDayEx: false,
        HundredDayEx: false
    });
    const [joinDate, setJoinDate] = useState("");

    interface PrivacySettings {
        publicProfile: boolean;
        birthday: boolean;
        about: boolean;
        linkedinLink: boolean;
        status: boolean;
        achievements: boolean;
    }

    const defaultPrivacySettings: PrivacySettings = {
        publicProfile: true,
        birthday: true,
        about: true,
        linkedinLink: true,
        status: true,
        achievements: true,
    };

    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(defaultPrivacySettings);

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
                if (public_user.birthday) {
                    setBirthday(`Birthday: ${public_user.birthday}`);
                }
                setAbout(public_user.about);
                setLinkedin(public_user.linkedIn_link);
                setJoinDate(public_user.join_date);
                const user = data.auth_user;
                setUserId(user._id);
                if (user.friends.includes(public_user.email)) {
                    setIsFriend(true);
                    setButtonText("Remove Friend");
                }
            }).catch(error => console.log(error));

        apiPost("/get_privacy", jsonData)
            .then(res => res.json())
            .then(data => {
                if (data.authorized && data.privacySettings) {
                    setPrivacySettings(data.privacySettings);
                } else {
                    console.log('Not authorized to fetch privacy settings or no settings available.');
                }
            })
            .catch(error => {
                console.log(error);
            });

        apiPost("/friend_request_sent", jsonData)
            .then(res => res.json())
            .then(data => {
                if (data.authorized) {
                    setFriendRequestSent(data.requestSent);
                    setButtonText(data.requestSent ? "Friend Request Sent" : "Add Friend");
                }
            })
            .catch(error => console.log(error));

        apiPost("/view_achievement", jsonData)
            .then(res => res.json())
            .then(data => {
                if (data.authorized && data.achievements) {
                    setAchievements(data.achievements);
                }
            })
            .catch(error => console.log(error));

    }, [navigate, id]);

    const handleOnClick = () => {
        const jsonData = JSON.stringify({ user_id: user_id, friend_id: id });
        if (isFriend) {
            apiPost("/remove_friend", jsonData)
                .then(() => {
                    setIsFriend(false);
                    setButtonText("Add Friend");
                })
                .catch(error => console.log(error));
        } else if (friendRequestSent) {
            apiPost("/cancel_friend_request", jsonData)
                .then(() => {
                    setButtonText("Add Friend");
                    setFriendRequestSent(false);
                })
                .catch(error => console.log(error));
        } else {
            apiPost("/send_friend_request", jsonData)
                .then(() => {
                    setButtonText("Friend Request Sent");
                    setFriendRequestSent(true);
                    alert("Friend request sent.");
                })
                .catch(error => console.log(error));
        }
    }

    return (
        <React.Fragment>
            <Navbar />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Card>
                    <div className="profile-content-container">
                        <ProfilePicture isUserProfile={false} base64Img={base64Image} isSmallScreen={false} />
                        <div className="profile-text-container">
                            <CardText type="header" text={`${firstName} ${lastName}'s Profile`} />
                            <p>Joined on {(joinDate as unknown as string).split('T')[0]}</p>
                            {privacySettings.birthday && birthday && <p>{birthday.split('T')[0]}</p>}
                            {privacySettings.linkedinLink && <a href={linkedin} target="_blank" rel="noopener noreferrer">{linkedin}</a>}
                        </div>
                    </div>

                    {privacySettings.achievements && <div>
                        <Divider style={{ marginTop: "16px" }} />
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Badges achievements={achievements} />
                        </div>
                    </div>}


                    <Button variant="contained" color="primary" fullWidth onClick={handleOnClick} sx={{ mt: 4 }}>
                        {buttonText}
                    </Button>


                    {privacySettings.about && <div>
                        <Divider style={{ marginTop: "16px" }} />
                        <CardText type="title" text="About" />
                        <CardText type="body" text={about} />
                    </div>}
                </Card>
            </Box>
        </React.Fragment>
    )
}

export default UserProfile;