import "../App.css";
import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const CreateAccount: React.FC = () => {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            username: data.get('username'),
            email: data.get('email'),
            password: data.get('password'),
            confirm_password: data.get('confirm_password')
        });
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
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </React.Fragment>
    )
}

export default CreateAccount