import './Card.css';
import React from "react";

const Divider = ({ style }: { style?: React.CSSProperties }) => {
    return <div className="divider" style={style} />;
};

export default Divider;