
import "../App.css";
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost } from "../api/serverApiCalls.tsx";
import { isValidEmail, isValidName, isValidPassword } from "../util/createAccountUtils.ts";
import { getFullAppLink, getServerCall } from "../util/getFullAppLink.ts";
const ResetPassword: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // collect data from text fields
        const data = new FormData(event.currentTarget);
        //const email = data.get('email');
        const token = id;
        //const emails = " ";
        const tokenJson = JSON.stringify({token})
        console.log("token in reset password !!!??????????/12213311435" +tokenJson)
        const emailResponse = await apiPost(getServerCall("/getEmailFromToken"),tokenJson)
        const emailData = await emailResponse.json();
        const email = emailData.email;
        //console.log("got out thingy");
        //console.log("am here " + email)
        const password = data.get('password');
        const confirmPassword = data.get('confirm_password');
        const jsonData = JSON.stringify({ email, password});
        console.log("password and email info" + jsonData);

        // validate user inputs
        //if (!isValidEmail(email as string, setEmailError)) return;
        if (!isValidPassword(password as string, confirmPassword as string, setPasswordError)) return;

        // take user data and post it to the database
        apiPost(getServerCall("/reset_password"), jsonData)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    alert("Password Succesfully changed.")
                    navigate('/login')
                } else {
                    alert("Error changing password")
                }
                
                })
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
                        {/* <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            error={emailError !== null}
                            helperText={emailError} /> */}
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

export default ResetPassword