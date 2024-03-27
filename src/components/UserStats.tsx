import "../App.css";
import React from 'react';
import Card from "./card/Card.tsx";
import CardRow from "./card/CardRow.tsx";
import CardList from "./card/CardList.tsx";
import Divider from "./card/Divider.tsx";
import Button from "@mui/material/Button";
import CardText from "./card/CardText.tsx";

const UserStats = ({ streak, completedExercises, navigate }) => {
    return (
        <Card>
            <CardRow>
                <CardText type="header" text="Your Statisitcs" style={{ marginTop: "0px", marginBottom: "0px" }} />
                <div className="card-button">
                    <Button variant="text" color="primary" onClick={() => navigate("/leaderboard")}>View Leaderboard</Button>
                </div>
            </CardRow>
            <Divider />
            <CardList>
                <CardText type="body" text={`Your current streak: ${streak}`} />
                <CardText type="body" text={`Your completed exercises: ${completedExercises}`} />
            </CardList>
        </Card>
    );
};

export default UserStats;