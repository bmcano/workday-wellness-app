import './Card.css';
import React from "react";

const Divider = ({ style, isVertical }: { style?: React.CSSProperties, isVertical?: boolean }) => {
    if (isVertical) {
        return <div className="vertical-divider" style={style} />;
    }
    return <div className="divider" style={style} />;
};

export default Divider;