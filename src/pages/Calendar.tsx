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
import UpcomingEventsLoading from "../components/UpcomingEventsLoading.tsx";
import DateRangeModal from "../components/modals/DateRangeModal.tsx";
import { getServerCall } from "../util/getFullAppLink.ts";

const Calendar: React.FC = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [events, setEvents] = useState<EventInput[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [deviceCodeMessage, setDeviceCodeMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleDateOpenModal = () => {
        checkOutlookClient();
        setIsDateModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsDateModalOpen(false);
    };

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate)
        apiGet(getServerCall("/get_calendar_data"))
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setEvents(data.calendar)
                }
            })
            .catch(error => console.log(error))
            .finally(() => setLoading(false));

        checkOutlookClient();
    }, [navigate])

    const checkOutlookClient = () => {
        apiGet(getServerCall("/check_outlook_client"))
            .then(res => res.json())
            .then(data => {
                console.log("Outlook Client: ", data)
                setLoggedIn(data.authorized)
                setIsDateModalOpen(data.authorized)
            })
            .catch(error => console.log(error));
    }

    const handleOutlookLogin = () => {
        apiGet(getServerCall("/initalize_outlook"))
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

    const handleCalendarSync = (start: Date, end: Date) => {
        const jsonData = JSON.stringify({ start: start, end: end });
        apiPost(getServerCall("/sync_calendar"), jsonData)
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
        apiPost(getServerCall("/save_calendar_data"), jsonData)
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
                        <Button type="submit" variant="contained" sx={{ mt: 2, mb: 2 }} onClick={handleDateOpenModal} disabled={!loggedIn}>Sync Calendar</Button>
                        <DateRangeModal isOpen={isDateModalOpen} onClose={handleCloseModal} onSave={handleCalendarSync} />
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
                    {loading ? (<UpcomingEventsLoading />) : (<UpcomingEvents events={events} />)}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Calendar;