import './Card.css';
import React from "react";
import PropTypes from 'prop-types';

const CardRow = ({ children, style }) => {
    return <div className="card-row" style={style}>{children}</div>
}

CardRow.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object
};

CardRow.defaultProps = {
    style: {}
};

export default CardRow;