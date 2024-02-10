import UserModel from '../models/Users.js';
import bcrypt from 'bcrypt';
import exercises from '../stub_data/exercises.json' assert { type: "json" };


/**
 * Job: Backend API calls for anything related to the user account, creation, and login/session management. 
 */

export const registerAccount = async (req, res) => {
    try {
        req.body.email = req.body.email.toLowerCase();
        const { email, password: plainTextPassword, first_name, last_name } = req.body;
        const password = await bcrypt.hash(plainTextPassword, 10);
        const user = new UserModel({
            email: email,
            password: password,
            first_name: first_name,
            last_name: last_name,
            profile_picture: "", // if empty we check for default profile picture elsewhere
            exercises: exercises[0] // the first item in this stub_data will be our defaults
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
        const id = user._id.toString();
        if (user.stub_data && user.password === password) {
            console.log("STUB_DATA");
            req.session._id = id;
            return res.json({ success: true });
        }
        if (await bcrypt.compare(password, user.password)) {
            req.session._id = id;
            return res.json({ success: true });
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

export const logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Session destruction error:', error);
            return res
                .status(500)
                .json({ error: "Internal Server Error" });
        }
        return res.json({ success: true });
    });
}

export const checkSession = (req, res) => {
    console.log("Session: ", req.session._id);
    if (req.session._id) {
        return res.json({ authorized: true, id: req.session._id });
    } else {
        return res.json({ authorized: false });
    }
}
