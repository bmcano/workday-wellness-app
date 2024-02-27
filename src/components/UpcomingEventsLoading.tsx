import React from 'react';
import Button from '@mui/material/Button';

const UpcomingEventsLoading: React.FC = () => {

    return (
        <div className="card">
            <div className="card-item">
                <div className="card-inside-header-text">Upcoming Events for Today</div>
                <div className="card-button">
                    <Button variant="text" color="primary" onClick={() => {}}>Add Event</Button>
                </div>
            </div>
            <div className="divider" />
            <div className="card-list">
                <div className='card-text'>Loading...</div>
            </div>
        </div>
    );
};

export default UpcomingEventsLoading;
