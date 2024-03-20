import "../App.css";
import React, { useEffect, useState } from 'react';
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import UploadImage from "../components/UploadImage.tsx";
import imageCompression from "browser-image-compression";
import { apiPost } from "../api/serverApiCalls.tsx";
import { getServerCall } from "../util/getFullAppLink.ts";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Navbar from "../components/Navbar.tsx";

const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [linkedinLink, setLinkedinLink] = useState('');
    const [workHours, setWorkHours] = useState({
        Monday: { start: '', end: '' },
        Tuesday: { start: '', end: '' },
        Wednesday: { start: '', end: '' },
        Thursday: { start: '', end: '' },
        Friday: { start: '', end: '' },
        Saturday: { start: '', end: '' },
        Sunday: { start: '', end: '' },
    });

    useEffect(() => {
        AuthorizedUser(navigate);
    }, [navigate]);

    const handleImageUpload = async (image: File) => {
        try {
            console.log(`File size: ${image.size / 1024} KB`);
            var base64Image = ""
            if (image.size > (100 * 1024)) {
                console.log("Compressing Image.");
                const options = {
                    maxSizeMB: 0.1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                }

                const compressedFile = await imageCompression(image, options);
                base64Image = await toBase64Encoding(compressedFile);
                console.log(`compressedFile size ${compressedFile.size / 1024} KB`);
            } else {
                base64Image = await toBase64Encoding(image);
            }

            const jsonData = JSON.stringify({ base64Image: base64Image });
            apiPost("/upload", jsonData);
            console.log("Photo saved successfully.");
        } catch (error) {
            console.error('Error saving image to database:', error);
        }
    };

    const toBase64Encoding = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result?.toString().split(",")[1] || "");
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const profileData = {
            name,
            birthday,
            password,
            bio,
            linkedinLink,
            workHours
        };

        console.log(profileData);
    };

    const handleWorkHoursChange = (day: string, type: 'start' | 'end', value: string) => {
        setWorkHours(prevHours => ({
            ...prevHours,
            [day]: {
                ...prevHours[day],
                [type]: value
            }
        }));
    };

    return (
        <React.Fragment>
            <Navbar />
            <div className="card">
                <h3>Image Upload</h3>
                <UploadImage handleImageUpload={handleImageUpload} />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="card-columns">
                    <div className="card-column">
                        <div className="card">
                            <h3>Profile Information</h3>
                            <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth margin="normal" />
                            <TextField label="Birthday" type="date" value={birthday} onChange={e => setBirthday(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth margin="normal" />
                            <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" />
                            <TextField label="Bio" multiline rows={4} value={bio} onChange={e => setBio(e.target.value)} fullWidth margin="normal" />
                            <TextField label="LinkedIn Link" value={linkedinLink} onChange={e => setLinkedinLink(e.target.value)} fullWidth margin="normal" />
                        </div>
                    </div>
                    <div className="card-column">
                        <div className="card">

                            {Object.keys(workHours).map((day) => (
                                <div key={day}>
                                    <Typography variant="body1">{day}</Typography>
                                    <TextField
                                        label="Start Time"
                                        type="time"
                                        value={workHours[day].start}
                                        onChange={(e) => handleWorkHoursChange(day, 'start', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="End Time"
                                        type="time"
                                        value={workHours[day].end}
                                        onChange={(e) => handleWorkHoursChange(day, 'end', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        margin="normal"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>Save Profile</Button>
            </form>
        </React.Fragment>
    );
};

export default EditProfile;
