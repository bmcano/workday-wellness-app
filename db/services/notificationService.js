import NotificationsModel from "../models/Notifications.js";

export const createNotification = async (userId, email, title, message, hasAccept, acceptType, other = "") => {
    const notification = new NotificationsModel({
        userId,
        email,
        title,
        message,
        hasAccept,
        acceptType,
        other
    });
    await notification.save();
};
