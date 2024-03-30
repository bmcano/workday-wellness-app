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

const EditPrivacySettings: React.FC = () => {
    const navigate = useNavigate();
    const [isInfoLoading, setIsInfoLoading] = useState(true);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [about, setAbout] = useState('');
    const [linkedinLink, setLinkedinLink] = useState('');

    useEffect(() => {
        AuthorizedUser(navigate);










        apiGet("/user")
            .then(data => {
                if (data.authorized) {
                    setFirstName(data.user.first_name);
                    setLastName(data.user.last_name);
                    if (data.user.birthday) {
                        setBirthday(data.user.birthday.slice(0, 10));
                    }
                    setAbout(data.user.about);
                    setLinkedinLink(data.user.linkedIn_link);
                }
            })
            .catch(error => console.log(error))
            .finally(() => setIsInfoLoading(false));
    }, [navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const jsonData = JSON.stringify({ first_name: firstName, last_name: lastName, birthday: birthday, about: about, linkedIn_link: linkedinLink })
        apiPost('/update_profile_information', jsonData).catch((error) => console.log(error));
    };

    return (
        <React.Fragment>
            <Navbar />
            <Column>
                <div>
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardText type="header" text="Profile Information" style={{ marginTop: "0px", marginBottom: "0px" }} />
                            <Divider />
                            {!isInfoLoading && <div>
                                <FormControlLabel
                                    control={<Checkbox checked={!!firstName} onChange={(e) => setFirstName(e.target.checked.toString())} />}
                                    label="First Name"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={!!lastName} onChange={(e) => setLastName(e.target.checked.toString())} />}
                                    label="Last Name"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={!!birthday} onChange={(e) => setBirthday(e.target.checked.toString())} />}
                                    label="Birthday"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={!!about} onChange={(e) => setAbout(e.target.checked.toString())} />}
                                    label="About"
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={!!linkedinLink} onChange={(e) => setLinkedinLink(e.target.checked.toString())} />}
                                    label="LinkedIn Link"
                                />
                                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>Update Profile</Button></div>}
                        </Card>
                    </form>
                </div>
            </Column>
        </React.Fragment>
    );
};

export default EditPrivacySettings;
