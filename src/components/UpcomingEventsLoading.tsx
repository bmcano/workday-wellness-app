import React from 'react';
import Button from '@mui/material/Button';
import Divider from './card/Divider.tsx';
import Card from './card/Card.tsx';
import CardRow from './card/CardRow.tsx';

const UpcomingEventsLoading: React.FC = () => {
    return (
        <Card>
            <CardRow>
                <div className="card-inside-header-text">Upcoming Events for Today</div>
                <div className="card-button">
                    <Button variant="text" color="primary" onClick={() => { }}>Add Event</Button>
                </div>
            </CardRow>
            <Divider />
            <CardRow>
                <div className='card-text'>Loading...</div>
            </CardRow>
        </Card>
    );
};

export default UpcomingEventsLoading;
