import "../App.css";
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";

const CreateAccount: React.FC = () => {

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // collect data from text fields
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');
        const confirmPassword = data.get('confirm_password');
        const first_name = data.get('first_name');
        const last_name = data.get('last_name');
        const jsonData = JSON.stringify({ email, password, first_name, last_name });
        console.log(jsonData);

        // validate user inputs
        if (!isValidEmail(email as string)) return;
        if (!isValidPassword(password as string, confirmPassword as string)) return;
        if (!isValidName(first_name as string, last_name as string)) {
            alert("One or more name items are left empty.");
            return;
        }

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
        const response = await result.json();
        console.warn(result);
        console.log(response)
        if (response.success) {
            alert("Account created.")
            navigate('/')
        } else if (response.message === "Email is already in use.") {
            setEmailError(response.message)
        }
    };

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = emailRegex.test(email);
        if (valid) {
            setEmailError(null);
            return true;
        }
        setEmailError("Invalid email address.");
        return false
    }

    const isValidPassword = (password: string, confirmPassword: string): boolean => {
        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return false;
        }
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return false;
        }
        setPasswordError(null);
        return true;
    };

    const isValidName = (first_name: string, last_name: string): boolean => {
        return first_name !== "" && last_name !== ""
    }

    return (
        <React.Fragment>
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
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            error={emailError !== null}
                            helperText={emailError} />
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="first_name"
                            label="First Name"
                            name="first_name"
                            autoComplete="first_name"
                            autoFocus />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="last_name"
                            label="Last Name"
                            name="last_name"
                            autoComplete="last_name"
                            autoFocus />
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
        </React.Fragment>
    )
}

export default CreateAccount