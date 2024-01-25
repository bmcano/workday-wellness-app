import "../App.css";
import React from 'react';
import Navbar from "../components/Navbar.tsx";

const Calendar: React.FC = () => {

    return (
        <React.Fragment>
            <Navbar />
            <h1>Calendar</h1>
        </React.Fragment>
    )
}

export default Calendar