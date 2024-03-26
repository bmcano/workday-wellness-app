import React, { useEffect, useState } from 'react';
import { EventInput } from '@fullcalendar/core';
import Button from '@mui/material/Button';
import AddEventModal from './modals/AddEventModal.tsx';
import { isEventOccuringNow } from '../util/dateUtils.ts';
import Divider from './card/Divider.tsx';
import Card from './card/Card.tsx';
import CardRow from './card/CardRow.tsx';
import CardList from './card/CardList.tsx';
import CardText from './card/CardText.tsx';

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
        <Card>
            <CardRow>
                <CardText type="header" text="Upcoming Events for Today" style={{ marginLeft: "-32px", marginTop: "0px", marginBottom: "0px" }} />
                <div className="card-button">
                    <Button variant="text" color="primary" onClick={handleOpenModal}>Add Event</Button>
                    <AddEventModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveEvent} />
                </div>
            </CardRow>
            <Divider />
            <CardList>
                {upcomingEvents.length === 0 ? (
                    <CardRow>
                        <CardText type="body" text="No events scheduled for today." />
                    </CardRow>
                ) : (
                    upcomingEvents.map((event, index) => (
                        <div key={index}>
                            <CardRow>
                                <CardList isHighlighted={isEventOccuringNow(event.start as Date, event.end as Date)}>
                                    <CardText type="title" text={`${event.title}:`} style={{marginTop: "8px"}}/>
                                    <CardText type="body" text={`Start: ${new Date(event.start as Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} style={{ marginTop: "-16px" }} />
                                    <CardText type="body" text={`End: ${new Date(event.end as Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`} style={{ marginTop: "-16px" }} />
                                </CardList>
                            </CardRow>
                            {index < upcomingEvents.length - 1 && <Divider />}
                        </div>
                    ))
                )}
            </CardList>
        </Card>
    );
};

export default UpcomingEvents;
