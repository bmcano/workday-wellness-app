import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { addCalendarData, checkIfOutlookClientExist, getCalendarData, getOutlookCalendar, initalizeOutlookClient, saveCalendarData, addOutlookEvent } from './controllers/outlookController.js';
import { checkSession, login, logout, registerAccount } from './controllers/sessionController.js';
import { uploadProfilePicture, getUser, getExerciseInformation, updateExerciseInformation } from './controllers/profileController.js';
import { addFriend, removeFriend, searchFriendsList, searchUsersList, viewUserProfile } from './controllers/friendsController.js';

/**
 * Server setup
 */
const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(bodyParser.json({ limit: '125kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '125kb' }));
app.use(json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

connect("mongodb://localhost:27017/wellness-app")

// see ./controllers/sessionController.js for more details.
app.post('/register', async (req, res) => registerAccount(req, res));
app.post('/login', async (req, res) => login(req, res));
app.post('/logout', (req, res) => logout(req, res));
app.get('/', (req, res) => checkSession(req, res));
// see ./controllers/profileController.js for more details.
app.get('/get_user', async (req, res) => getUser(req, res));
app.post('/upload', async (req, res) => uploadProfilePicture(req, res));
app.get('/get_exercise_information', async (req, res) => getExerciseInformation(req, res));
app.post('/update_exercise_information', async (req, res) => updateExerciseInformation(req, res));
// see ./controllers/friendsController.js for more details.
app.get('/search_users', async (req, res) => searchUsersList(req, res));
app.get('/friends_list', async (req, res) => searchFriendsList(req, res));
app.post('/view_profile', async (req, res) => viewUserProfile(req, res));
app.post('/add_friend', async (req, res) => addFriend(req, res));
app.post('/remove_friend', async (req, res) => removeFriend(req, res));
// see ./controllers/outlookController.js for more details
app.get('/check_outlook_client', async (req, res) => checkIfOutlookClientExist(req, res));
app.get('/initalize_outlook', async (req, res) => initalizeOutlookClient(req, res));
app.get('/sync_calendar', async (req, res) => getOutlookCalendar(req, res));
app.get('/get_calendar_data', async (req, res) => getCalendarData(req, res));
app.post('/save_calendar_data', async (req, res) => saveCalendarData(req, res));
app.post('/add_calendar_data', async (req, res) => addCalendarData(req, res));
app.post('/add_outlook_event', async (req, res) => addOutlookEvent(req, res));

app.listen(3001, () => {
    console.log("Database is running.");
});
