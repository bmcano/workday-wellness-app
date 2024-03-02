import React, { useEffect, useState } from 'react';
import { EventInput } from '@fullcalendar/core';
import Button from '@mui/material/Button';
import AddEventModal from './modals/AddEventModal.tsx';
import { isEventOccuringNow } from '../util/dateUtils.ts';

interface Props {
    events: EventInput[];
}

const UpcomingEvents: React.FC<Props> = ({ events }) => {
    const now = new Date();
    const cstDate = new Date(now.getTime());
    const todayDate = cstDate.toISOString().split('T')[0];
    const [upcomingEvents, setUpcomingEvents] = useState<EventInput[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const updatedEvents = events.filter(event => event.start?.toString().startsWith(todayDate));
        setUpcomingEvents(updatedEvents);
        
        const intervalId = setInterval(() => {
            const updatedEvents = events.filter(event => event.start?.toString().startsWith(todayDate));
            setUpcomingEvents(updatedEvents);
        }, 1000 * 60); // checks the event time every minute to update highlighting
    
        return () => clearInterval(intervalId);
    }, [events, todayDate]);
    
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveEvent = (eventData: any) => {
        console.log('Event saved: ', eventData);
        window.location.reload();
        handleCloseModal();
    };

    return (
        <div className="card">
            <div className="card-item">
                <div className="card-inside-header-text">Upcoming Events for Today</div>
                <div className="card-button">
                    <Button variant="text" color="primary" onClick={handleOpenModal}>Add Event</Button>
                    <AddEventModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveEvent} />
                </div>
            </div>
            <div className="divider" />
            <div className="card-list">
                {upcomingEvents.length === 0 ? (
                    <div className="card-item">
                        <p className="card-text">No events scheduled for today</p>
                    </div>
                ) : (
                    upcomingEvents.map((event, index) => (
                        <div key={index}>
                            <li className="card-item">
                                <div className={isEventOccuringNow(event.start as Date, event.end as Date) ? "card-list-highlighted" : "card-list"}>
                                    <p className="card-title-text">{event.title}:</p>
                                    <p className="card-text">Start: {new Date(event.start as Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    <p className="card-text">End: {new Date(event.end as Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </li>
                            {index < upcomingEvents.length - 1 && <div className="divider" />}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UpcomingEvents;
