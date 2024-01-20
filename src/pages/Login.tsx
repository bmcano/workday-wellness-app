import "../App.css";
import React, { useState } from 'react';
import TextBox from "../components/TextBox.tsx";

const Login: React.FC = () => {

    const [inputEmail, setInputEmail] = useState<string>('');
    const [inputPassword, setInputPassword] = useState<string>('');

    const handleEmailChange = (newValue: string) => {
        setInputEmail(newValue);
    };

    const handlePasswordChange = (newValue: string) => {
        setInputPassword(newValue);
    };

    return (
        <React.Fragment>
            <h1>Login</h1>
            <TextBox
                value={inputEmail}
                onChange={handleEmailChange}
                placeholder="Email" />
            <TextBox
                value={inputPassword}
                onChange={handlePasswordChange}
                placeholder="Passowrd" />
        </React.Fragment>
    )
}

export default Login