import "../App.css";
import React, { useEffect, useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // API FOR NOTIFICATIONS
// @ts-ignore
// import messageSound from '../static/sounds/popcorn.mp3'
import Drawer from "@mui/material/Drawer";
import { Button } from "@mui/material";
import CardText from "./card/CardText.tsx";
import NotificationCard from "./card/NotificationCard.tsx";
import Divider from "./card/Divider.tsx";
import { apiGet, apiPost } from "../api/serverApiCalls.tsx";

interface Notification {
    _id: string,
    email: string,
    title: string,
    message: string,
    hasAccept: boolean,
    acceptType: string,
    isRead: boolean
}

const Notifications: React.FC<{ openDrawer: boolean }> = ({ openDrawer }) => {

    const [notificationList, setNotificationList] = useState<Notification[]>([])
    const [open, setOpen] = useState(openDrawer);
    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        apiGet("/notifications")
            .then(data => {
                if (data.authorized) {
                    setNotificationList(data.notifications)
                }
            })
            .catch(error => console.log(error));
    }, [])

    const onDismiss = (index: number) => {
        // Filter out the dismissed notification based on its index
        const updatedList = notificationList.filter((_, idx) => idx !== index);
        setNotificationList(updatedList);
        const jsonData = JSON.stringify({ _id: notificationList[index]._id });
        apiPost("/dismiss_notification", jsonData).catch((error) => console.log(error));
    }

    const onAcceptExercise = (index: number) => {
        // make a DB call to user stat table to update completion, count, and poentially streak value

        onDismiss(index);
    }

    return (
        <Drawer anchor="right" open={open} onClose={handleDrawerClose}>
            <div className="drawer-header">
                <CardText type="header" text="Notifications" />
                <Divider />
            </div>
            {notificationList.length === 0 && <CardText type="title" text="No notifications" style={{ width: "372px", textAlign: "center" }} />}
            {notificationList.map((notification, index) => (
                <NotificationCard
                    key={index}
                    title={notification.title}
                    body={notification.message}
                    onDismiss={() => onDismiss(index)}
                    hasAccept={notification.hasAccept}
                    onAccept={onAcceptExercise}
                />
            ))}
            <Divider />
            <Button onClick={handleDrawerClose} color="primary">Close</Button>
        </Drawer>
    )
}

export default Notifications