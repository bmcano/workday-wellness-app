import './Card.css';
import React from "react";
import PropTypes from 'prop-types';

const NotificationCard = ({ children }) => {
    return <div className="notification-card">{children}</div>
}

NotificationCard.propTypes = {
    children: PropTypes.node.isRequired,
};

export default NotificationCard;