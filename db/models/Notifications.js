import { Schema, model } from 'mongoose';

const NotificationsSchema = new Schema({
    email: { type: String, required: true, unique: true },
    notifications: [
        {
            title: { type: String },
            body: { type: String },
            hasAccept: { type: Boolean },
            acceptType: { tpye: String }
        }
    ]
});

const NotificationsModel = model("notifications", NotificationsSchema);
export default NotificationsModel;