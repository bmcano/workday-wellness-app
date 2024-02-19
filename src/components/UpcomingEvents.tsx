import React from 'react';
import { EventInput } from '@fullcalendar/core';
import Button from '@mui/material/Button';

interface Props {
    events: EventInput[];
}

const UpcomingEvents: React.FC<Props> = ({ events }) => {
    const now = new Date();
    const cstOffset = -6 * 60 * 60 * 1000; // CST is UTC - 6 hours
    const cstDate = new Date(now.getTime() + cstOffset);
    const todayDate = cstDate.toISOString().split('T')[0];
    const upcomingEvents = events.filter(event => event.start?.toString().startsWith(todayDate));

    return (
        <div className="card">
            <div className="card-item">
                <div className="card-inside-header-text">Upcoming Events for Today</div>
                <div className="card-button">
                    <Button variant="text" color="primary" onClick={() => { } /** TODO - be able to manually add exercise events */}>Add Event</Button>
                </div>
            </div>
            <div className="card-list">
                {upcomingEvents.length === 0 ? (
                    <div className="card-item">
                        <p className="card-text">No events scheduled for today</p>
                    </div>
                ) : (
                    upcomingEvents.map((event, index) => (
                        <div key={index}>
                            <li className="card-item">
                                <div className="card-list">
                                    <p className="card-title-text">{event.title}:</p>
                                    <p className="card-text">Start: {new Date(event.start as Date).toLocaleTimeString()}</p>
                                    <p className="card-text">End: {new Date(event.end as Date).toLocaleTimeString()}</p>
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
