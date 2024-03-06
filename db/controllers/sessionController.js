import UserModel from '../models/Users.js';
import bcrypt from 'bcrypt';
import exercises from '../stub_data/exercises/exercises_00.json' assert { type: "json" };
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * (NOT AN API CALL) => getUserInformation(token) - retrieves the user's _id and email after a login
 * 
 * GET:
 *  "/" => checkSession(req, res) - validates JWT token to see if user is logged in
 * POST:
 *  "/register" => registerAccount(req, res) - creates a new account to the database with default configurations
 *  "/login" => login(res, res) - validates a user login and creates a JWT token
 */

export const getUserInformation = (token) => {
    const key = process.env.REACT_APP_SESSION_SECRET;
    try {
        const decoded = jwt.verify(token, key);
        return { _id: decoded._id, email: decoded.email };
    } catch (error) {
        // If the token is invalid or expired, return null
        console.error('Error decoding token:', error);
        return null;
    }
}

export const checkSession = (req, res) => {
    // formated as 'Bearer {token}'
    const token = req.headers.authorization.split(' ')[1];
    const key = process.env.REACT_APP_SESSION_SECRET;
    jwt.verify(token, key, (error, decoded) => {
        if (error) {
            console.log(error);
            return res.json({ authorized: false, message: 'Invalid token' });
        } else {
            console.log(decoded);
            return res.json({ authorized: true });
        }
    });
}

export const registerAccount = async (req, res) => {
    try {
        req.body.email = req.body.email.toLowerCase();
        const { email, password: plainTextPassword, first_name, last_name } = req.body;
        const password = await bcrypt.hash(plainTextPassword, process.env.REACT_APP_SESSION_SECRET || 10);
        const user = new UserModel({
            email: email,
            password: password,
            first_name: first_name,
            last_name: last_name,
            profile_picture: "", // if empty we check for default profile picture elsewhere
            exercises: exercises[0], // the first item in this stub_data will be our defaults
            calendar: [] // calendar should be empty by default
        });
        let result = await user.save();
        result = result.toObject();
        if (result) {
            console.log(result);
            return res.json({ success: true, message: "Account successfully created." });
        } else {
            return res.json({ success: false, message: "Account was unable to be created." });
        }
    } catch (error) {
        console.log(error);
        if (error.code === 11000) { // Duplicate key error
            return res.json({ success: false, message: "Email is already in use." });
        } else {
            return res
                .status(500)
                .json({ error: "Internal Server Error" });
        }
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "Email or password does not match" });
        }

        if (user.stub_data && user.password === password) {
            console.log("STUB_DATA");
            const user_data = {
                _id: user._id.toString(),
                email: user.email
            }
            console.log("ID: ", user._id.toString())
            const key = process.env.REACT_APP_SESSION_SECRET
            jwt.sign(user_data, key, (err, token) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to generate token' });
                } else {
                    return res.json({ success: true, token: token });
                }
            });
            return;
        }
        if (await bcrypt.compare(password, user.password)) {
            const user_data = {
                id: user._id.toString(),
                email: user.email
            }
            const key = process.env.REACT_APP_SESSION_SECRET
            jwt.sign(user_data, key, (err, token) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to generate token' });
                } else {
                    return res.json({ success: true, token: token });
                }
            });
            return;
        }
        return res
            .status(400)
            .json({ success: false, message: "Email or password does not match" });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Internal Server Error" });
    }
}
