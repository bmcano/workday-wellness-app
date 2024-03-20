import UserModel from '../models/Users.js';
import bcrypt from 'bcrypt';
import exercises from '../stub_data/exercises/exercises_00.json' assert { type: "json" };
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * (NOT AN API CALL):
 *  - generateToken(userData) - creates a JWT and signs it with the user's id and email
 *  - getUserInformation(token) - retrieves the user's _id and email after a login
 * 
 * GET:
 *  "/" => checkSession(req, res) - validates JWT token to see if user is logged in
 * POST:
 *  "/register" => registerAccount(req, res) - creates a new account to the database with default configurations
 *  "/login" => login(res, res) - validates a user login and creates a JWT token
 */

const generateToken = (userData) => {
    const key = process.env.REACT_APP_SESSION_SECRET;
    return new Promise((resolve, reject) => {
        jwt.sign(userData, key, (err, token) => {
            if (err) {
                reject('Failed to generate token');
            } else {
                resolve(token);
            }
        });
    });
};

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
        if (error || decoded._id === undefined) {
            console.log(error);
            return res.json({ authorized: false, message: 'Invalid token' });
        } else {
            return res.json({ authorized: true });
        }
    });
}

export const registerAccount = async (req, res) => {
    try {
        req.body.email = req.body.email.toLowerCase();
        const { email, password: plainTextPassword, first_name, last_name } = req.body;
        const password = await bcrypt.hash(plainTextPassword, 10);
        // const currentDate = new Date();
        // const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // const formattedDate = currentDate.toLocaleDateString('en-US', options);
        const user = new UserModel({
            email: email,
            password: password,
            first_name: first_name,
            last_name: last_name,
            linkedIn_link: "",
            about: "",
            profile_picture: "", // if empty we check for default profile picture elsewhere
            exercises: exercises[0], // the first item in this stub_data will be our defaults
            calendar: [] // calendar should be empty by default
        });
        let result = await user.save();
        result = result.toObject();
        if (result) {
            console.log(result); // will eventually remove
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
        //console.log("in session controller " + user.email + "  " + user.password)
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
            const token = await generateToken(user_data);
            return res.json({ success: true, token: token });
        }
        else if (await bcrypt.compare(password, user.password)) {
            const user_data = {
                _id: user._id.toString(),
                email: user.email
            }
            const token = await generateToken(user_data);
            return res.json({ success: true, token: token });
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
