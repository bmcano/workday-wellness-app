import './Card.css';
import React from "react";

type TextType = "header" | "title" | "body";
interface TextProps {
    type: TextType,
    text: string,
    style?: React.CSSProperties;
}

const CardText: React.FC<TextProps> = ({ type, text, style }) => {
    switch (type) {
        case "header":
            return <p className="card-header-text" style={style}>{text}</p>
        case "title":
            return <p className="card-title-text" style={style}>{text}</p>
        case "body":
            return <p className="card-body-text" style={style}>{text}</p>
        default:
            return <p className="card-body-text" style={style}>{text}</p>
    }
}

export default CardText;