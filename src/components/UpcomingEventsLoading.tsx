import React from 'react';
import Button from '@mui/material/Button';
import Divider from './card/Divider.tsx';
import Card from './card/Card.tsx';
import CardRow from './card/CardRow.tsx';
import CardText from './card/CardText.tsx';

const UpcomingEventsLoading: React.FC = () => {
    return (
        <Card>
            <CardRow>
                <CardText type="header" text="Upcoming Events for Today" style={{ marginTop: "0px", marginBottom: "0px" }} />
                <div className="card-button">
                    <Button variant="text" color="primary" onClick={() => { }}>Add Event</Button>
                </div>
            </CardRow>
            <Divider />
            <CardRow>
                <CardText type="body" text="Loading..." />
            </CardRow>
        </Card>
    );
};

export default UpcomingEventsLoading;
