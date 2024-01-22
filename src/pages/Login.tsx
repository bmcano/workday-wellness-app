import "../App.css";
import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

const Login: React.FC = () => {

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');
        const jsonData = JSON.stringify({ email, password })
        console.log(jsonData);

        let result = await fetch(
            'http://localhost:3001/login', {
            method: "post",
            body: jsonData,
            credentials: 'include',
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const response = await result.json()
        console.warn(result);
        if (result.ok) {
            const success = response.success
            if (success) {
                console.log("Login successful");
                navigate('/');
            } else {
                alert("Login Failed.");
            }
        } else {
            alert("Incorrect email or password.")
        }
    };

    return (
        <React.Fragment>
            <ThemeProvider theme={defaultTheme}>
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
                                    <Link href="" variant="body2">Forgot password?</Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/create_account" variant="body2">Don't have an account?</Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </React.Fragment>
    )
}

export default Login;