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

    const [open, setOpen] = useState(openDrawer);
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Drawer anchor="right" open={open} onClose={handleDrawerClose}>
            <div className="drawer-header">
                <CardText type="header" text="Notifications" />
                <Divider />
            </div>
            {/* This will eventually be a list of notification it gathers from the DB */}
            <NotificationCard>
                <CardText type="header" text="Notification 1" />
            </NotificationCard>
            <NotificationCard>
                <CardText type="header" text="Notification 1" />
            </NotificationCard>
            <NotificationCard>
                <CardText type="header" text="Notification 1" />
            </NotificationCard>
            <NotificationCard>
                <CardText type="header" text="Notification 1" />
            </NotificationCard>
            <NotificationCard>
                <CardText type="header" text="Notification 1" />
            </NotificationCard>
            <NotificationCard>
                <CardText type="header" text="Notification 1" />
            </NotificationCard>
            <NotificationCard>
                <CardText type="header" text="Notification 1" />
            </NotificationCard>
            <Button onClick={handleDrawerClose} color="primary">Close</Button>
        </Drawer>
    )
}

export default Notifications