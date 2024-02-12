/**
 * Job: String validation checks of all of the user inputs for account creation.
 */

export const isValidEmail = (email: string, setEmailError: (value: React.SetStateAction<string | null>) => void): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(email);
    if (valid) {
        setEmailError(null);
        return true;
    }
    setEmailError("Invalid email address.");
    return false;
}

export const isValidPassword = (
    password: string,
    confirmPassword: string,
    setPasswordError: (value: React.SetStateAction<string | null>) => void
): boolean => {
    // TODO - make stronger password checks later on towards end of project.
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

export const isValidName = (first_name: string, last_name: string): boolean => {
    return first_name !== "" && last_name !== ""
}