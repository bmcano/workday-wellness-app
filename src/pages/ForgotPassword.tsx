import "../App.css";
import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { apiPost } from "../api/serverApiCalls.tsx";
import { getFullAppLink } from "../util/getFullAppLink.ts";
import { v4 as uuidv4 } from 'uuid';

const ForgotPassword: React.FC = () => {

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const subject = "Reset Password"
        const token = uuidv4();
        const text = `Please click the following link to reset your password: https://github.com/bmcano/workday-wellness-app/reset-password/${token}`
        const jsonData = JSON.stringify({ email, subject, text, token })
        apiPost('/does_email_exist', jsonData)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    apiPost("/send_email", jsonData).catch((error) => console.log(error));
                    apiPost("/set_token", jsonData).catch((error) => console.log(error));
                    alert("Email has been sent");
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
                        <Grid container>
                            <Grid item xs>
                                <Link href={getFullAppLink("/login")} variant="body2">Login</Link>
                            </Grid>
                            <Grid item>
                                <Link href={getFullAppLink("/create_account")} variant="body2">Don't have an account?</Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    )
}

export default ForgotPassword;