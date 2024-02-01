import express, { json } from 'express'
import { connect } from 'mongoose'
import cors from 'cors'
import UserModel from './models/Users.js'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'


/**
 * Server setup
 */
const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["POST", "GET"],
    credentials: true
}))
app.use(json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

connect("mongodb://localhost:27017/wellness-app")

/**
 * These following methods are all related to accounts by creation, login, logout, and authorization
 */
app.post('/register', async (req, res) => {
    try {
        req.body.email = req.body.email.toLowerCase()
        const { email, password: plainTextPassword, first_name, last_name } = req.body;
        const password = await bcrypt.hash(plainTextPassword, 10);
        const user = new UserModel({
            email,
            password,
            first_name,
            last_name
        });
        let result = await user.save();
        result = result.toObject();
        console.log(result)
        if (result) {
            console.log(result);
            return res.json({ success: true, message: "Account successfully created." })
        } else {
            return res.json({ success: false, message: "Account was unable to be created." })
        }
    } catch (e) {
        console.log("Error: ", e);
        if (e.code === 11000) { // Duplicate key error
            return res.json({ success: false, message: "Email is already in use." });
        } else {
            return res.json({ success: false, message: "An error occurred." });
        }
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email.toLowerCase() }).lean()
        console.log(user._id.toString())
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
        return { status: 'error', error: 'timed out' }
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
        }
        return res.json({ success: true });
    });
});

app.get('/', (req, res) => {
    console.log("Session: ", req.session._id)
    if (req.session._id) {
        return res.json({ authorized: true, id: req.session._id })
    } else {
        return res.json({ authorized: false })
    }
})

/**
 * These methods are all related to the a users friends: Add, Remove, View
 */
app.get('/friends_list', async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.session._id }).lean();
        if (!user) {
            return res
                .status(404)
                .json({ error: "User not found" });
        }
        const friendsEmails = user.friends;
        const friendsDetails = await UserModel.find({ email: { $in: friendsEmails } }).lean();
        const friendsStub = friendsDetails.map(friend => {
            return {
                id: friend._id.toString(),
                first_name: friend.first_name,
                last_name: friend.last_name
            };
        });
        console.log("Friends API")
        console.log(friendsStub)
        return res.json(friendsStub);
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Internal Server Error" });
    }
})



app.listen(3001, () => {
    console.log("Database is running")
})