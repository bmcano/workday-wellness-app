import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { addCalendarData, checkIfOutlookClientExist, getCalendarData, getOutlookCalendar, initalizeOutlookClient, saveCalendarData, addOutlookEvent, addUserRecommendations } from './controllers/outlookController.js';
import { checkSession, login, registerAccount } from './controllers/sessionController.js';
import { uploadProfilePicture, getUser, updateExerciseInformation, doesEmailExistInDatabase, sendEmail, resetPassword, setToken, getEmailFromToken, clearToken, updateProfileInformation, updateScheduleInformation, getScheduleInformation } from './controllers/profileController.js';
import { addFriend, removeFriend, friendsList, usersList, viewUserProfile } from './controllers/friendsController.js';
import { getFriendLeaderboardCompleted, getFriendLeaderboardStreak, getGlobalLeaderboardCompleted, getGlobalLeaderboardStreak, getUserRecords, updateUserAchievement, getUserAchievements, viewingUserAchievements } from './controllers/statisticsController.js';
import { getPrivacySettings, getUserPrivacy, updatePrivacySettings } from './controllers/privacyController.js';
import { dismissNotification, getNotifications, getTodaysEvents, updateExerciseStats, createFriendRequestNotification, friendRequestSent, cancelFriendRequest } from './controllers/notificationsController.js';
import { updateStatus, getFriendsStatuses, getStatuses } from './controllers/statusController.js';

/**
 * Server setup
 */
const app = express();
app.use(cors({
    origin: process.env.REACT_APP_WEBSITE_URL,
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(json());
app.use(cookieParser());

//connect("mongodb://127.0.0.1:27017/wellness-app");
connect(process.env.REACT_APP_MONGO_ATLAS);

// see ./controllers/sessionController.js for more details.
app.get('/', (req, res) => checkSession(req, res));
app.post('/register', async (req, res) => registerAccount(req, res));
app.post('/login', async (req, res) => login(req, res));
// see ./controllers/profileController.js for more details.
app.get('/user', async (req, res) => getUser(req, res));
app.get('/schedule', async (req, res) => getScheduleInformation(req, res));
app.post('/upload', async (req, res) => uploadProfilePicture(req, res));
app.post('/update_exercise_information', async (req, res) => updateExerciseInformation(req, res));
app.post('/does_email_exist', async (req, res) => doesEmailExistInDatabase(req, res));
app.post('/send_email', async (req, res) => sendEmail(req, res));
app.post('/reset_password', async (req, res) => resetPassword(req, res));
app.post('/set_token', async (req, res) => setToken(req, res));
app.post('/clear_token', async (req, res) => clearToken(req, res));
app.post('/get_email_from_token', async (req, res) => getEmailFromToken(req, res));
app.post('/update_profile_information', async (req, res) => updateProfileInformation(req, res));
app.post('/update_schedule_information', async (req, res) => updateScheduleInformation(req, res));
// see ./controllers/friendsController.js for more details.
app.get('/users_list', async (req, res) => usersList(req, res));
app.get('/friends_list', async (req, res) => friendsList(req, res));
app.post('/view_profile', async (req, res) => viewUserProfile(req, res));
app.post('/add_friend', async (req, res) => addFriend(req, res));
app.post('/remove_friend', async (req, res) => removeFriend(req, res));
// see ./controllers/outlookController.js for more details
app.get('/check_outlook_client', async (req, res) => checkIfOutlookClientExist(req, res));
app.get('/initalize_outlook', async (req, res) => initalizeOutlookClient(req, res));
app.get('/get_calendar_data', async (req, res) => getCalendarData(req, res));
app.post('/sync_calendar', async (req, res) => getOutlookCalendar(req, res));
app.post('/save_calendar_data', async (req, res) => saveCalendarData(req, res));
app.post('/add_calendar_data', async (req, res) => addCalendarData(req, res));
app.post('/add_outlook_event', async (req, res) => addOutlookEvent(req, res));
app.post('/add_user_recommendations', async (req, res) => addUserRecommendations(req, res));
// see ./controllers/statisticsController.js for more details
app.get('/get_global_leaderboard_streak', async (req, res) => getGlobalLeaderboardStreak(req, res));
app.get('/get_global_leaderboard_completed', async (req, res) => getGlobalLeaderboardCompleted(req, res));
app.get('/get_friend_leaderboard_streak', async (req, res) => getFriendLeaderboardStreak(req, res));
app.get('/get_friend_leaderboard_completed', async (req, res) => getFriendLeaderboardCompleted(req, res));
app.get('/get_user_records', async (req, res) => getUserRecords(req, res));
app.post('/update_achievement', async (req, res) => updateUserAchievement(req, res));
app.get('/get_achievement', async (req, res) => getUserAchievements(req, res));
app.post('/view_achievement', async (req, res) => viewingUserAchievements(req, res));
//see ./controllers/privacyController.js for more details
app.get('/privacy', async (req, res) => getPrivacySettings(req, res));
app.post('/update_privacy', async (req, res) => updatePrivacySettings(req, res));
app.post('/get_privacy', async (req, res) => getUserPrivacy(req, res));
// see ./controllers/notificaationsController.js for more details
app.get('/notifications', async (req, res) => getNotifications(req, res));
app.get('/todays_events', async (req, res) => getTodaysEvents(req, res));
app.post('/notification_exercise_update', async (req, res) => updateExerciseStats(req, res));
app.post('/send_friend_request', async (req, res) => createFriendRequestNotification(req, res));
app.post('/dismiss_notification', async (req, res) => dismissNotification(req, res));
app.post('/friend_request_sent', async (req, res) => friendRequestSent(req, res));
app.post('/cancel_friend_request', async (req, res) => cancelFriendRequest(req, res));
// see ./controllers/statusController.js for more details
app.get('/get_friend_status', async (req, res) => getFriendsStatuses(req, res));
app.get('/user_status', async (req, res) => getStatuses(req, res));
app.post('/status', async (req, res) => updateStatus(req, res));

app.listen(3001, () => {
    console.log("Database is running.");
});
