import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { apiGet, apiPost } from "../api/serverApiCalls.tsx";
import { getCurrentFormattedDate } from "../util/dateUtils.ts";
import { convertOutlookPayload } from "../util/convertOutlookPayload.ts";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventInput } from '@fullcalendar/core'
import UpcomingEvents from "../components/UpcomingEvents.tsx";
import DeviceCodeModal from "../components/modals/DeviceCodeModal.tsx";

const Calendar: React.FC = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [events, setEvents] = useState<EventInput[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deviceCodeMessage, setDeviceCodeMessage] = useState("");

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate)
        apiGet('http://localhost:3001/get_calendar_data')
            .then(res => res.json())
            .then(data => {
                if (data.success) setEvents(data.calendar)
            })
            .catch(error => console.log(error));

        checkOutlookClient();
    }, [navigate])

    const checkOutlookClient = () => {
        apiGet('http://localhost:3001/check_outlook_client')
            .then(res => res.json())
            .then(data => {
                console.log("Outlook Client: ", data)
                setLoggedIn(data.authorized)
            })
            .catch(error => console.log(error));
    }

    const handleOutlookLogin = () => {
        apiGet("http://localhost:3001/initalize_outlook")
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.authorized) {
                    console.log(data.deviceCodeMessage.message);
                    setDeviceCodeMessage(data.deviceCodeMessage);
                    handleOpenModal();
                    setLoggedIn(true);
                } else {
                    console.log("Problem with Outlook.")
                }
            })
            .catch(error => console.log(error));
    }

    const handleCalendarSync = () => {
        checkOutlookClient();
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

    const handleSaveEvents = () => {
        const jsonData = JSON.stringify({ calendar: events })
        console.log(jsonData);
        apiPost('http://localhost:3001/save_calendar_data', jsonData)
            .catch(error => console.log(error));
        alert("Events have been saved.");
    }

    return (
        <React.Fragment>
            <Navbar />
            <div className="card">
                <div className="card-item">
                    <div className="card-inside-header-text">{getCurrentFormattedDate()}</div>
                    <div className="card-button">
                        <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }} onClick={handleOutlookLogin}>Login to Outlook</Button>
                        <DeviceCodeModal isOpen={isModalOpen} onClose={handleCloseModal} deviceCodeMessage={deviceCodeMessage} />
                        <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }} onClick={handleCalendarSync} disabled={!loggedIn}>Sync Calendar</Button>
                        <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }} onClick={handleSaveEvents}>Save Events</Button>
                    </div>
                </div>
            </div>
            <div className="card-columns">
                <div className="card-column">
                    <div className="card">
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
                                eventColor="red"
                                eventBackgroundColor="red"
                            />
                        </div>
                    </div>
                </div>
                <div className="card-column">
                    <UpcomingEvents events={events} />
                </div>
            </div>
        </React.Fragment>
    )
}

export default Calendar;