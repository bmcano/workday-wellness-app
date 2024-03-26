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
import GenerateRecommendations from "../components/GenerateRecommendations.tsx";
import Card from "../components/card/Card.tsx";

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
        apiGet("/get_calendar_data")
            .then(data => {
                if (data.authorized) {
                    setEvents(data.calendar)
                }
            })
            .catch(error => console.log(error))
            .finally(() => setLoading(false));

        checkOutlookClient();
    }, [navigate])

    const checkOutlookClient = () => {
        apiGet("/check_outlook_client")
            .then(data => {
                setLoggedIn(data.authorized)
                if (!data.authorized) {
                    setIsDateModalOpen(false)
                }

            })
            .catch(error => console.log(error));
    }

    const handleOutlookLogin = () => {
        apiGet("/initalize_outlook")
            .then(data => {
                if (data.authorized) {
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
        apiPost("/sync_calendar", jsonData)
            .then(res => res.json())
            .then(data => {
                if (data.authorized) {
                    const outlookEvents = convertOutlookPayload(data.calendar.value[0]);
                    console.log(outlookEvents);
                    setEvents(outlookEvents);
                } else {
                    console.log("Problem with Outlook.");
                }
            })
            .catch(error => console.log(error));
    }

    const handleSaveEvents = () => {
        const jsonData = JSON.stringify({ calendar: events })
        apiPost("/save_calendar_data", jsonData).catch(error => console.log(error));
        alert("Events have been saved.");
    }

    return (
        <React.Fragment>
            <Navbar />
            <Card>
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
            </Card>
            <div className="card-columns">
                <div className="card-column">
                    <Card>
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
                    </Card>
                </div>
                <div className="card-column">
                    <GenerateRecommendations />
                    {loading ? (<UpcomingEventsLoading />) : (<UpcomingEvents events={events} />)}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Calendar;