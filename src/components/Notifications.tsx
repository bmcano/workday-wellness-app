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

const Notifications: React.FC<{ openDrawer: boolean }> = ({ openDrawer }) => {

    const [notificationList, setNotificationList] = useState([])
    const [open, setOpen] = useState(openDrawer);
    const handleDrawerClose = () => {
        setOpen(false);
    };

    const onDismiss = () => {
        // TODO: remove specific notification from the list of them
        setNotificationList([]);
    }

    const onAcceptExercise = () => {
        // make a DB call to user stat table to update completion, count, and poentially streak value
    }

    return (
        <Drawer anchor="right" open={open} onClose={handleDrawerClose}>
            <div className="drawer-header">
                <CardText type="header" text="Notifications" />
                <Divider />
            </div>
            {/* This will eventually be a list of notification it gathers from the DB */}
            <NotificationCard
                title="title"
                body="lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
                onDismiss={onDismiss}
                hasAccept={true}
                onAccept={onAcceptExercise}
            />

            <Button onClick={handleDrawerClose} color="primary">Close</Button>
        </Drawer>
    )
}

export default Notifications