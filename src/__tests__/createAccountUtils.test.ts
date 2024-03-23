import { isValidEmail, isValidPassword, isValidName } from '../util/createAccountUtils.ts';

describe('isValidEmail function', () => {
    it('returns true for a valid email address', () => {
        const setEmailError = jest.fn();
        const isValid = isValidEmail('test@example.com', setEmailError);
        expect(isValid).toBe(true);
        expect(setEmailError).toHaveBeenCalledWith(null);
    });

    it('returns false and sets error for an invalid email address 1', () => {
        const setEmailError = jest.fn();
        const isValid = isValidEmail('invalid-email', setEmailError);
        expect(isValid).toBe(false);
        expect(setEmailError).toHaveBeenCalledWith('Invalid email address.');
    });

    it('returns false and sets error for an invalid email address 2', () => {
        const setEmailError = jest.fn();
        const isValid = isValidEmail('example@email', setEmailError);
        expect(isValid).toBe(false);
        expect(setEmailError).toHaveBeenCalledWith('Invalid email address.');
    });

    it('returns false and sets error for an invalid email address 3', () => {
        const setEmailError = jest.fn();
        const isValid = isValidEmail('example@email.', setEmailError);
        expect(isValid).toBe(false);
        expect(setEmailError).toHaveBeenCalledWith('Invalid email address.');
    });
});

describe('isValidPassword function', () => {
    it('returns true for valid password and matching confirmPassword', () => {
        const setPasswordError = jest.fn();
        const isValid = isValidPassword('password123', 'password123', setPasswordError);
        expect(isValid).toBe(true);
        expect(setPasswordError).toHaveBeenCalledWith(null);
    });

    it('returns false and sets error for password less than 8 characters', () => {
        const setPasswordError = jest.fn();
        const isValid = isValidPassword('pass', 'pass', setPasswordError);
        expect(isValid).toBe(false);
        expect(setPasswordError).toHaveBeenCalledWith('Password must be at least 8 characters');
    });

    it('returns false and sets error for passwords not matching', () => {
        const setPasswordError = jest.fn();
        const isValid = isValidPassword('password123', 'password456', setPasswordError);
        expect(isValid).toBe(false);
        expect(setPasswordError).toHaveBeenCalledWith('Passwords do not match');
    });
});

describe('isValidName function', () => {
    it('returns true for valid first and last names', () => {
        const isValid = isValidName('John', 'Doe');
        expect(isValid).toBe(true);
    });

    it('returns false if either first or last name is empty', () => {
        const isValid = isValidName('', 'Doe');
        expect(isValid).toBe(false);

        const isValid2 = isValidName('John', '');
        expect(isValid2).toBe(false);
    });

    it('returns false for both fields being empty', () => {
        const isValid = isValidName('', '');
        expect(isValid).toBe(false);
    });
});
