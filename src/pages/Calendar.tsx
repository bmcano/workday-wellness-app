import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { configDotenv } from "dotenv";

const Calendar: React.FC = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [calendar, setCalendar] = useState("");

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate)
        fetch(
            "http://localhost:3001/check_outlook_client", {
            method: "get",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("Outlook Client: ", data)
                setLoggedIn(data.authorized)
            })
    }, [navigate])

    const handleOutlookLogin = () => {
        fetch(
            "http://localhost:3001/initalize_outlook", {
            method: "get",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.authorized) {
                    console.log(data.deviceCodeMessage.message);
                    alert(`Use code: ${data.deviceCodeMessage.userCode}`)
                    window.open(data.deviceCodeMessage.verificationUri);
                    setLoggedIn(true)
                } else {
                    console.log("Problem with Outlook.")
                }
            })
    }

    const handleCalendarSync = () => {
        fetch(
            "http://localhost:3001/sync_calendar", {
            method: "get",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.authorized) {
                    console.log(data.calendar);
                    setCalendar(data.calendar.value[0].scheduleId)
                    console.log("CALENDAR: ", calendar)
                } else {
                    console.log("Problem with Outlook.")
                }
            })
    }

    return (
        <React.Fragment>
            <Navbar />
            <h1>Calendar</h1>
            <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }} onClick={handleOutlookLogin} >Login to Outlook</Button>
            <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }} onClick={handleCalendarSync} disabled={!loggedIn}>Sync Calendar</Button>
            <p>
                {calendar.toString()}
            </p>
        </React.Fragment>
    )
}

export default Calendar;