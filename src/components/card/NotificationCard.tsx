import './Card.css';
import React from "react";
import CardText from "./CardText.tsx";
import Divider from "./Divider.tsx";
import CardRow from "./CardRow.tsx";
import Button from '@mui/material/Button';
// @ts-ignore
import { ReactComponent as XStateFarm } from "../../static/assets/XStateFarm.svg"
// @ts-ignore
import { ReactComponent as Check } from "../../static/assets/CheckmarkSF.svg"

const NotificationCard = ({ title, body, onDismiss, hasAccept, onAccept }) => {
    return (
        <div className="notification-card">
            <CardText type="title" text={title} />
            <Divider />
            <CardText type="body" text={body} />
            <CardRow>
                <div className='card-button'>
                    <Button onClick={onDismiss}>
                        <XStateFarm />
                    </Button>
                    {hasAccept && <Button onClick={onAccept}>
                        <Check />
                    </Button>}
                </div>
            </CardRow>
        </div>
    )
}

NotificationCard.defaultProps = {
    hasAccept: true,
    onAccept: () => {}
};

export default NotificationCard;