import "../App.css";
import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const CreateAccount: React.FC = () => {

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // collect data from text fields
        const data = new FormData(event.currentTarget);
        const username = data.get('username');
        const email = data.get('email');
        const password = data.get('password');
        const jsonData = JSON.stringify({ username, email, password });
        console.log(jsonData);
        // take user data and post it to the database
        let result = await fetch(
            'http://localhost:3001/register', {
                method: "post",
                body: jsonData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        result = await result.json();
        console.warn(result);
        if (result) {
            alert("Data saved succesfully");
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
                        <Typography component="h1" variant="h5">Create Account</Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus />
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
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirm_password"
                                label="Confirm Password"
                                type="confirm_password"
                                id="confirm_password"
                                autoComplete="confirm-current-password" />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                            >
                                Create Account
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="" variant="body2">Forgot password?</Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/login" variant="body2">Already have an account?</Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </React.Fragment>
    )
}

export default CreateAccount