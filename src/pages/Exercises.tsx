import "../App.css";
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import exerecises from "../static/json/exercises_consts.json"
import Divider from "../components/card/Divider.tsx";
import Card from "../components/card/Card.tsx";
import CardRow from "../components/card/CardRow.tsx";

const Exercises: React.FC = () => {

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate)
    }, [navigate])

    const stretches = exerecises.filter(point => point.title.includes('Stretches'));
    const exercisesMisc = exerecises.filter(point => !point.title.includes('Stretches'));

    return (
        <React.Fragment>
            <Navbar />
            <Card>
                <CardRow>
                    <div className="card-text">
                        This a list of all of our stretches, exercises, and more to help promote workday wellness.
                        You can manage and edit the items we recommend for you on the edit page.
                    </div>
                    <div className="card-button">
                        <Button variant="contained" color="primary" onClick={() => navigate('/exercises/edit')}>Edit Exercises</Button>
                    </div>
                </CardRow>
            </Card>
            <div className="card-columns">
                <div className="card-column">
                    {stretches.map(point => (
                        <div key={point.id}>
                            <p className="card-header-text">{point.title}</p>
                            <Card>
                                {point.subPoints.map((subPoint, index) => (
                                    <li key={subPoint.id} className="card-list">
                                        <CardRow>
                                            <div className="card-text">{subPoint.title}</div>
                                            <div className="card-button">
                                                <Button variant="text" color="primary" onClick={() => window.open(subPoint.youtubeURL)}>More Info</Button>
                                            </div>
                                        </CardRow>
                                        {index !== point.subPoints.length - 1 && <Divider />}
                                    </li>
                                ))}
                            </Card>
                        </div>
                    ))}
                </div>
                <div className="card-column">
                    {exercisesMisc.map(point => (
                        <div key={point.id}>
                            <p className="card-header-text">{point.title}</p>
                            <Card>
                                {point.subPoints.map((subPoint, index) => (
                                    <li key={subPoint.id} className="card-list">
                                        <div className="card-item">
                                            <div className="card-text">{subPoint.title}</div>
                                            <div className="card-button">
                                                <Button variant="text" color="primary" onClick={() => window.open(subPoint.youtubeURL)}>More Info</Button>
                                            </div>
                                        </div>
                                        {index !== point.subPoints.length - 1 && <Divider />}
                                    </li>
                                ))}
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
}

export default Exercises;