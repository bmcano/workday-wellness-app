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
        const jsonData = JSON.stringify({ _id: notificationList[index]._id });
        setNotificationList(updatedList);
        apiPost("/dismiss_notification", jsonData).catch((error) => console.log(error));
    }

    const onAcceptExercise = (index: number) => {
        const jsonData = JSON.stringify({ exercise: notificationList[index].title })
        apiPost("/notification_exercise_update", jsonData).catch((error) => console.log(error));
        onDismiss(index);
    }

    return (
        <Drawer anchor="right" open={open} onClose={handleDrawerClose}>
            <div className="drawer-header">
                <CardText type="header" text={notificationList.length === 0 ? "No notifications" : "Notifications"} style={{ width: "468px" }} />
                <Divider style={{ marginLeft: "16px", marginRight: "16px" }} />
            </div>
            {notificationList.map((notification, index) => (
                <NotificationCard
                    key={index}
                    title={notification.title}
                    body={notification.message}
                    onDismiss={() => onDismiss(index)}
                    hasAccept={notification.hasAccept}
                    onAccept={() => onAcceptExercise(index)}
                />
            ))}
            {notificationList.length > 0 && <Divider style={{ marginLeft: "16px", marginRight: "16px" }} />}
            <Button onClick={handleDrawerClose} color="primary">Close</Button>
        </Drawer>
    )
}

export default Notifications