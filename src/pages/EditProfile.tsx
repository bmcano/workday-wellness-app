import "../App.css";
import React, { useEffect, useState } from 'react';
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import UploadImage from "../components/UploadImage.tsx";
import imageCompression from "browser-image-compression";
import { apiGet, apiPost } from "../api/serverApiCalls.tsx";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Navbar from "../components/Navbar.tsx";
import Card from "../components/card/Card.tsx";
import Column from "../components/card/Column.tsx";
import CardText from "../components/card/CardText.tsx"
import Divider from "../components/card/Divider.tsx";

const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const [isInfoLoading, setIsInfoLoading] = useState(true);
    const [isScheduleLoading, setIsScheduleLoading] = useState(true);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [about, setAbout] = useState('');
    const [linkedinLink, setLinkedinLink] = useState('');
    const [workHours, setWorkHours] = useState({
        Monday: { start: '08:00', end: '17:00' },
        Tuesday: { start: '08:00', end: '17:00' },
        Wednesday: { start: '08:00', end: '17:00' },
        Thursday: { start: '08:00', end: '17:00' },
        Friday: { start: '08:00', end: '17:00' }
    });

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

        apiGet("/schedule")
            .then(data => {
                if (data.authorized) {
                    const schedule = data.schedule;
                    setWorkHours({
                        Monday: { start: schedule.monday_start, end: schedule.monday_end },
                        Tuesday: { start: schedule.tuesday_start, end: schedule.tuesday_end },
                        Wednesday: { start: schedule.wednesday_start, end: schedule.wednesday_end },
                        Thursday: { start: schedule.thursday_start, end: schedule.thursday_end },
                        Friday: { start: schedule.friday_start, end: schedule.friday_end }
                    })
                } else {
                    console.log("Using default scheudle.");
                }
            })
            .catch(error => console.log(error))
            .finally(() => setIsScheduleLoading(false));

    }, [navigate]);

    const handleImageUpload = async (image: File) => {
        try {
            console.log(`File size: ${image.size / 1024} KB`);
            var base64Image = ""
            if (image.size > (100 * 1024)) {
                const options = {
                    maxSizeMB: 0.1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                }

                const compressedFile = await imageCompression(image, options);
                base64Image = await toBase64Encoding(compressedFile);
                console.log(`Compressed file size: ${compressedFile.size / 1024} KB`);
            } else {
                base64Image = await toBase64Encoding(image);
            }

            const jsonData = JSON.stringify({ base64Image: base64Image });
            apiPost("/upload", jsonData).catch(error => console.log(error));
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
        const jsonData = JSON.stringify({ first_name: firstName, last_name: lastName, birthday: birthday, about: about, linkedIn_link: linkedinLink })
        apiPost('/update_profile_information', jsonData).catch((error) => console.log(error));
    };

    const handleSchedule = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const jsonData = JSON.stringify({
            monday_start: workHours.Monday.start,
            monday_end: workHours.Monday.end,
            tuesday_start: workHours.Tuesday.start,
            tuesday_end: workHours.Tuesday.end,
            wednesday_start: workHours.Wednesday.start,
            wednesday_end: workHours.Wednesday.end,
            thursday_start: workHours.Thursday.start,
            thursday_end: workHours.Thursday.end,
            friday_start: workHours.Friday.start,
            friday_end: workHours.Friday.end,
        })
        apiPost('/update_schedule_information', jsonData).catch((error) => console.log(error));
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
            <Column>
                <div>
                    <UploadImage handleImageUpload={handleImageUpload} />
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardText type="header" text="Profile Information" style={{ marginTop: "0px", marginBottom: "0px" }} />
                            <Divider />
                            {!isInfoLoading && <div>
                                <TextField label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} fullWidth margin="normal" />
                                <TextField label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} fullWidth margin="normal" />
                                <TextField label="Birthday" type="date" value={birthday} onChange={e => setBirthday(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth margin="normal" />
                                <TextField label="About" multiline rows={4} value={about} onChange={e => setAbout(e.target.value)} fullWidth margin="normal" />
                                <TextField label="LinkedIn Link" value={linkedinLink} onChange={e => setLinkedinLink(e.target.value)} fullWidth margin="normal" />
                                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>Update Profile</Button></div>}
                        </Card>
                    </form>
                </div>
                <form onSubmit={handleSchedule}>
                    <Card>
                        <CardText type="header" text="Work Schedule" style={{ marginTop: "0px", marginBottom: "0px" }} />
                        <Divider />
                        {!isScheduleLoading && Object.keys(workHours).map((day) => (
                            <div key={day}>
                                <CardText type="title" text={day} style={{ marginLeft: "16px", marginBottom: "8px"}}/>
                                <TextField
                                    label="Start Time"
                                    type="time"
                                    value={workHours[day].start}
                                    onChange={(e) => handleWorkHoursChange(day, 'start', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    margin="normal"
                                    style={{ marginLeft: '16px' }}
                                />
                                <TextField
                                    label="End Time"
                                    type="time"
                                    value={workHours[day].end}
                                    onChange={(e) => handleWorkHoursChange(day, 'end', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    margin="normal"
                                    style={{ marginLeft: '16px', marginRight: "32px" }}
                                />
                            </div>
                        ))}
                        <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '16px', marginTop: '16px' }}>Update Schedule</Button>
                    </Card>
                </form>
            </Column>
        </React.Fragment>
    );
};

export default EditProfile;
