
import "../App.css";
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate, useParams } from "react-router-dom";
import { apiPost } from "../api/serverApiCalls.tsx";
import { isValidPassword } from "../util/createAccountUtils.ts";
import { getServerCall } from "../util/getFullAppLink.ts";
const ResetPassword: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const navigate = useNavigate();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // collect data from text fields
        const data = new FormData(event.currentTarget);
        const token = id;
        const tokenJson = JSON.stringify({ token });
        const emailResponse = await apiPost(getServerCall("/get_email_from_token"), tokenJson);
        const emailData = await emailResponse.json();
        const email = emailData.email;
        const password = data.get('password');
        const confirmPassword = data.get('confirm_password');
        const jsonData = JSON.stringify({ email, password });

        // validate user inputs
        if (!isValidPassword(password as string, confirmPassword as string, setPasswordError)) return;

        // take user data and post it to the database
        apiPost(getServerCall("/reset_password"), jsonData)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Password succesfully changed.");
                    navigate('/login');
                } else {
                    alert("Error changing password.");
                }
            })
            .catch((error) => console.log(error));
    };

    return (
        <React.Fragment>
            <Container component="main" maxWidth="xs">
                <Box sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Typography component="h1" variant="h5">Change Password</Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={passwordError !== null}
                            helperText={passwordError} />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirm_password"
                            label="Confirm Password"
                            type="password"
                            id="confirm_password"
                            autoComplete="current-password" />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2 }}>Change Password</Button>

                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    )
}

export default ResetPassword;