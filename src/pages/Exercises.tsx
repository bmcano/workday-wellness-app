import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import exerecises from "../static/json/exercises_consts.json"
import Divider from "../components/card/Divider.tsx";
import Card from "../components/card/Card.tsx";
import CardRow from "../components/card/CardRow.tsx";
import RedirectLinkModal from "../components/modals/RedirectLinkModal.tsx";
import CardText from "../components/card/CardText.tsx";
import Column from "../components/card/Column.tsx";
import CardList from "../components/card/CardList.tsx";

const Exercises: React.FC = () => {

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate)
    }, [navigate])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const stretches = exerecises.filter(point => point.title.includes('Stretches'));
    const exercisesMisc = exerecises.filter(point => !point.title.includes('Stretches'));

    const CardRowWithEndButton = (title: string, url: string) => {
        return (
            <CardRow>
                <CardText type="body" text={title} />
                <div className="card-button">
                    <Button variant="text" color="primary" onClick={handleOpenModal}>More Info</Button>
                    <RedirectLinkModal isOpen={isModalOpen} onClose={handleCloseModal} link={url} />
                </div>
            </CardRow>
        )
    }

    return (
        <React.Fragment>
            <Navbar />
            <Card>
                <CardRow>
                    <CardText type="body" text="Explore our collection of stretches, exercises, and wellness tips designed to enhance your workday well-being. You can manage your recommended items on the edit  page." />
                    <div className="card-button">
                        <Button variant="contained" color="primary" onClick={() => navigate('/exercises/edit')}>Edit Exercises</Button>
                    </div>
                </CardRow>
            </Card>
            <Column>
                <div>
                    {stretches.map(point => (
                        <div key={point.id}>
                            <CardText type="header" text={point.title} style={{ marginLeft: "32px" }} />
                            <Card>
                                {point.subPoints.map((subPoint, index) => (
                                    <div key={subPoint.id}>
                                        <CardList>
                                            {CardRowWithEndButton(subPoint.title, subPoint.youtubeURL)}
                                            {index !== point.subPoints.length - 1 && <Divider />}
                                        </CardList>
                                    </div>
                                ))}
                            </Card>
                        </div>
                    ))}
                </div>
                <div>
                    {exercisesMisc.map(point => (
                        <div key={point.id}>
                            <CardText type="header" text={point.title} style={{ marginLeft: "32px" }} />
                            <Card>
                                {point.subPoints.map((subPoint, index) => (
                                    <div key={subPoint.id}>
                                        <CardList>
                                            {CardRowWithEndButton(subPoint.title, subPoint.youtubeURL)}
                                            {index !== point.subPoints.length - 1 && <Divider />}
                                        </CardList>
                                    </div>
                                ))}
                            </Card>
                        </div>
                    ))}
                </div>
            </Column>
        </React.Fragment>
    );
}

export default Exercises;