import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';

const NotificationsSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    hasAccept: { type: Boolean, default: false },
    acceptType: { tpye: String },
    isRead: { type: Boolean, default: false }
});

const NotificationsModel = model("notifications", NotificationsSchema);
export default NotificationsModel;