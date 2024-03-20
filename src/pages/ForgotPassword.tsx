import "../App.css";
import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { apiPost } from "../api/serverApiCalls.tsx";
import { getServerCall } from "../util/getFullAppLink.ts";
import { v4 as uuidv4 } from 'uuid';

// Generate a unique token using UUID library

const ForgotPassword: React.FC = () => {

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const subject = "Reset Password"
        const token = uuidv4();
        const text = `Please click the following link to reset your password http://localhost:3000${process.env.PUBLIC_URL}/reset-password/${token}`
        const jsonData = JSON.stringify({ email,subject,text,token})
        console.log(jsonData);
        apiPost(getServerCall('/does_email_exist'), jsonData)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    apiPost(getServerCall("/send_email"),jsonData)
                    alert("Email has been sent");
                    apiPost(getServerCall("/setToken"),jsonData)
                    
                } else {
                    alert("Email does not exist");
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
                    <Typography component="h1" variant="h5">Forgot Password</Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    )
}

export default ForgotPassword;