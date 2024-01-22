import express, { json } from 'express'
import { connect } from 'mongoose'
import cors from 'cors'
import UserModel from './models/Users.js'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

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

app.post('/register', async (req, res) => {
    try {
        // check to see if email is already in use.
        const existingEmail = await UserModel.findOne({ email: req.body.email.toLowerCase() });
        if (existingEmail && existingEmail.email !== undefined) {
            return res.json({ success: false, message: "Email is already in use." });
        }

        // if not in use create the account
        req.body.email = req.body.email.toLowerCase() 
        const user = new UserModel(req.body);
        let result = await user.save();
        result = result.toObject();
        if (result) {
            console.log(result);
            return res.json({ success: true, message: "Account successfully created." })
        } else {
            return res.json({ success: false, message: "User already exists." })
        }
    } catch (e) {
        return res.json({ success: false, message: "Something went wrong." })
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email.toLowerCase() }).catch(
        (err) => {
            console.log("Error: ", err);
        }
    );

    if (!user) {
        // user account does not exist
        return res
            .status(400)
            .json({ success: false, message: "Email or password does not match" });
    }

    if (user.password !== password) {
        // account exist, but password does not match
        return res
            .status(400)
            .json({ success: false, message: "Email or password does not match" });
    }

    req.session.email = user.email;
    return res.json({ success: true });
})

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
      return res.json({ success: true });
    });
});

app.get('/', (req, res) => {
    console.log("Session: ", req.session.email)
    if (req.session.email) {
        return res.json({ authorized: true, email: req.session.email })
    } else {
        return res.json({ authorized: false })
    }
})

app.listen(3001, () => {
    console.log("Database is running")
})