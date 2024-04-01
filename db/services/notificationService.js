import NotificationsModel from "../models/Notifications.js";

export const createNotification = async (userId, email, title, message, hasAccept, acceptType) => {
    const notification = new NotificationsModel({
        userId,
        email,
        title,
        message,
        hasAccept,
        acceptType
    });
    await notification.save();
};
