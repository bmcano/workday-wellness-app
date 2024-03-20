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
import { getFullAppLink } from "../util/getFullAppLink.ts";

const Login: React.FC = () => {

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');
        const jsonData = JSON.stringify({ email, password })
        console.log(jsonData);

        apiPost("/login", jsonData)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log("Login successful");
                    localStorage.setItem("token", data.token);
                    navigate('/');
                } else {
                    alert("Incorrect email or password.");
                }
            })
            .catch(() => alert("Login failed."));
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
                    <Typography component="h1" variant="h5">Login</Typography>
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password" />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                        >
                            Login
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href={getFullAppLink("/forgot_password")} variant="body2">Forgot password?</Link>
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

export default Login;