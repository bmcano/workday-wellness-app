import "../App.css";
import React, { useEffect, useState } from 'react';
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api/serverApiCalls.tsx";
import Button from "@mui/material/Button";
import Navbar from "../components/Navbar.tsx";
import Card from "../components/card/Card.tsx";
import Column from "../components/card/Column.tsx";
import CardText from "../components/card/CardText.tsx"
import Divider from "../components/card/Divider.tsx";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const LifetimeStats: React.FC = () => {
    const navigate = useNavigate();
    const [publicProfile, setPublicProfile] = useState(true);
    const [birthdayPrivate, setBirthdayPrivate] = useState(true);
    const [aboutPrivate, setAboutPrivate] = useState(true);
    const [linkedinLinkPrivate, setLinkedinLinkPrivate] = useState(true);

    useEffect(() => {
        AuthorizedUser(navigate);
        apiGet(`/get_privacy`).then((data) => {
            setPublicProfile(data.privacySettings.publicProfile);
            setBirthdayPrivate(data.privacySettings.birthdayPrivate);
            setAboutPrivate(data.privacySettings.aboutPrivate);
            setLinkedinLinkPrivate(data.privacySettings.linkedinLinkPrivate);
            console.log(data);
        }).catch((error) => console.log(error));
    }, [navigate]);

    const handlePrivacy = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const jsonData = JSON.stringify({
            publicProfile: publicProfile,
            birthdayPrivate: birthdayPrivate,
            aboutPrivate: aboutPrivate,
            linkedinLinkPrivate: linkedinLinkPrivate
        })
        apiPost('/update_privacy', jsonData).catch((error) => console.log(error));
    };

    return (
        <React.Fragment>
            <Navbar />
            <Column>
                <div>
                    <form onSubmit={handlePrivacy}>
                        <Card>
                            <CardText type="header" text="Profile Information:" style={{ marginTop: "0px", marginBottom: "0px" }} />
                            <p>Choose which parts of your profile information you would like to keep private</p>
                            <p>Check indicates that the information is public</p>
                            <Divider />
                            {<div>
                                <FormControlLabel
                                control={<Checkbox checked={publicProfile} onChange={(e) => setPublicProfile(e.target.checked)} />}
                                label="Public Profile"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={birthdayPrivate} onChange={(e) => setBirthdayPrivate(e.target.checked)} />}
                                label="Birthday"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={aboutPrivate} onChange={(e) => setAboutPrivate(e.target.checked)} />}
                                label="About"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={linkedinLinkPrivate} onChange={(e) => setLinkedinLinkPrivate(e.target.checked)} />}
                                label="LinkedIn"
                            />
                                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>Update Profile</Button></div>}
                        </Card>
                    </form>
                </div>
            </Column>
        </React.Fragment>
    );
};

export default LifetimeStats;