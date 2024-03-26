import './Card.css';
import React from "react";
import PropTypes from 'prop-types';

const CardRow = ({ children }) => {
    return <div className="card-row">{children}</div>
}

CardRow.propTypes = {
    children: PropTypes.node.isRequired
};

export default CardRow;