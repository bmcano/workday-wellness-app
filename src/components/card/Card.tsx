import './Card.css';
import React from "react";
import PropTypes from 'prop-types';

const Card = ({ children, isHighlighted, isModal }) => {
    if (isModal) {
        return <div className="modal-card">{children}</div>
    }
    if (isHighlighted) {
        return <div className="card-highlighted">{children}</div>
    }
    return <div className="card">{children}</div>
}

Card.propTypes = {
    children: PropTypes.node.isRequired,
    isHighlighted: PropTypes.bool,
    isModal: PropTypes.bool
};

Card.defaultProps = {
    isHighlighted: false,
    isModal: false
};

export default Card;