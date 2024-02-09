import "../App.css";
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import exerecises from "../static/json/exercises_consts.json"

const Exercises: React.FC = () => {
    const navigate = useNavigate()

    useEffect(() => {
        AuthorizedUser(navigate)
    }, [navigate])

    // Filter points into stretches and exercises/miscellaneous
    const stretches = exerecises.filter(point => point.title.includes('Stretches'));
    const exercisesMisc = exerecises.filter(point => !point.title.includes('Stretches'));

    return (
        <React.Fragment>
            <Navbar />
            <div className="card">
                <div className="card-item">
                    <div className="card-text">
                        This a list of all of our stretches, exercises, and more items to help promote workday wellness.
                        You can manage and edit the items and times we recommend for you on the edit page.
                    </div>
                    <div className="card-button">
                        <Button variant="contained" color="primary" onClick={() => navigate('/exercises/edit')}>Edit Exercises</Button>
                    </div>
                </div>
            </div>


            <div className="exercise-columns">
                <div className="exercise-column">
                    {stretches.map(point => (
                        <div key={point.id}>
                            <h2 className="card-header-text">{point.title}</h2>
                            <ul className="card">
                                {point.subPoints.map((subPoint, index) => (
                                    <li key={subPoint.id} className="card-list">
                                        <div className="card-item">
                                            <div className="card-text">{subPoint.title}</div>
                                            <div className="card-button">
                                                <Button variant="contained" color="primary" onClick={() => window.open(subPoint.youtubeURL)}>Tutorial</Button>
                                            </div>
                                        </div>
                                        {index !== point.subPoints.length - 1 && <div className="divider" />}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="exercise-column">
                    {exercisesMisc.map(point => (
                        <div key={point.id}>
                            <h2 className="card-header-text">{point.title}</h2>
                            <ul className="card">
                                {point.subPoints.map((subPoint, index) => (
                                    <li key={subPoint.id} className="card-list">
                                        <div className="card-item">
                                            <div className="card-text">{subPoint.title}</div>
                                            <div className="card-button">
                                                <Button variant="contained" color="primary" onClick={() => window.open(subPoint.youtubeURL)}>Tutorial</Button>
                                            </div>
                                        </div>
                                        {index !== point.subPoints.length - 1 && <div className="divider" />}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
}

export default Exercises;