import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { apiGet } from "../api/serverApiCalls.tsx";
import { getCurrentFormattedDate } from "../util/dateUtils.ts";
import { convertOutlookPayload } from "../util/convertOutlookPayload.ts";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventInput } from '@fullcalendar/core'


const Calendar: React.FC = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [events, setEvents] = useState<EventInput[]>([])

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate)
        apiGet('http://localhost:3001/check_outlook_client')
            .then(res => res.json())
            .then(data => {
                console.log("Outlook Client: ", data)
                setLoggedIn(data.authorized)
            })
    }, [navigate])

    const handleOutlookLogin = () => {
        apiGet("http://localhost:3001/initalize_outlook")
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
            .catch(error => console.log(error));
    }

    const handleCalendarSync = () => {
        apiGet('http://localhost:3001/sync_calendar')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.authorized) {
                    const outlookEvents = convertOutlookPayload(data.calendar.value[0]);
                    console.log(outlookEvents)
                    setEvents(outlookEvents);
                } else {
                    console.log("Problem with Outlook.");
                }
            })
    }

    return (
        <React.Fragment>
            <Navbar />
            <div className="card">
                <div className="card-item">
                    <div className="card-text">{getCurrentFormattedDate()}</div>
                    <div className="card-button">
                        <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }} onClick={handleOutlookLogin} >Login to Outlook</Button>
                        <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }} onClick={handleCalendarSync} disabled={!loggedIn}>Sync Calendar</Button>
                    </div>
                </div>
            </div>
            <div className="box-card">
                <div className="calendar">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        initialView='dayGridMonth'
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        weekends={false}
                        initialEvents={events}
                        events={events}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

export default Calendar;