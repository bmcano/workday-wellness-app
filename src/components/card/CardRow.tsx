import './Card.css';
import React from "react";
import PropTypes from 'prop-types';

const CardRow = ({ children, style, isHighlighted, isTableRow }) => {
    if (isHighlighted && isTableRow) {
        return <div className="card-table-row-highlighted" style={style}>{children}</div>
    }
    if (isHighlighted) {
        return <div className="card-row-highlighted" style={style}>{children}</div>
    }
    if (isTableRow) {
        return <div className="card-table-row" style={style}>{children}</div>
    }
    return <div className="card-row" style={style}>{children}</div>
}

CardRow.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
    isHighlighted: PropTypes.bool,
    isTableRow: PropTypes.bool
};

CardRow.defaultProps = {
    style: {},
    isHighlighted: false,
    isTableRow: false
};

export default CardRow;