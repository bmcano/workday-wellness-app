import "../App.css";
import React, { useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // API FOR NOTIFICATIONS
// @ts-ignore
// import messageSound from '../static/sounds/popcorn.mp3'
import Drawer from "@mui/material/Drawer";
import { Button } from "@mui/material";
import CardText from "./card/CardText.tsx";
import NotificationCard from "./card/NotificationCard.tsx";
import Divider from "./card/Divider.tsx";

interface Notification {
    title: string,
    body: string,
    hasAccept: boolean,
    acceptType: string
}

const Notifications: React.FC<{ openDrawer: boolean }> = ({ openDrawer }) => {

    const [notificationList, setNotificationList] = useState<Notification[]>([
        { title: "notification 1", body: "lorem ipsum", hasAccept: false, acceptType: "none" },
        { title: "notification 2", body: "lorem ipsum", hasAccept: false, acceptType: "none" },
        { title: "notification 3", body: "lorem ipsum", hasAccept: true, acceptType: "none" },
        { title: "notification 4", body: "lorem ipsum", hasAccept: true, acceptType: "none" }
    ])
    const [open, setOpen] = useState(openDrawer);
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const onDismiss = (index: number) => {
        // Filter out the dismissed notification based on its index
        const updatedList = notificationList.filter((_, idx) => idx !== index);
        setNotificationList(updatedList);
    }

    const onAcceptExercise = (index: number) => {
        // make a DB call to user stat table to update completion, count, and poentially streak value

        // onDismiss(index);
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
                    body={notification.body}
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