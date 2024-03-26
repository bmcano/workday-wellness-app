import './Card.css';
import React from "react";
import PropTypes from 'prop-types';

const CardList = ({ children }) => {
    return <div className="card-list">{children}</div>
}

CardList.propTypes = {
    children: PropTypes.node.isRequired
};

export default CardList;