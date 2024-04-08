import './Card.css';
import React from "react";
import PropTypes from 'prop-types';

const CardList = ({ children, isHighlighted, style }) => {
    if (isHighlighted) {
        return <div className="card-list-highlighted" style={style}>{children}</div>
    }
    return <div className="card-list" style={style}>{children}</div>
}

CardList.propTypes = {
    children: PropTypes.node.isRequired,
    isHighlighted: PropTypes.bool,
    style: PropTypes.object
};

CardList.defaultProps = {
    isHighlighted: false,
    style: {}
};

export default CardList;