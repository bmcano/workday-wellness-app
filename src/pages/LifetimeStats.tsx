import "../App.css";
import React, { useEffect, useState } from 'react';
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import { apiGet} from "../api/serverApiCalls.tsx";
import Navbar from "../components/Navbar.tsx";
import Card from "../components/card/Card.tsx";
import Column from "../components/card/Column.tsx";
import CardText from "../components/card/CardText.tsx"

const LifetimeStats: React.FC = () => {
    const navigate = useNavigate();
    const [completedExercises, setCompletedExercises] = useState<string>('0');

    useEffect(() => {
        AuthorizedUser(navigate);
        apiGet(`/get_user_records`).then((data) => {
            if (data.authorized) {
                const completed = data.completedExercises;
                setCompletedExercises(completed);
                console.log(data);
            } else {
                console.log("Using default scheudle.");
            }
        }).catch((error) => console.log(error));
    }, [navigate]);

    return (
        <React.Fragment>
            <Navbar />
            <Column>
                <div>
                    <Card>
                        <CardText type="header" text="Lifetime Stats:" style={{ marginTop: "0px", marginBottom: "0px" }} />
                        <p>Total exercises completed: {completedExercises}</p>
                    </Card>
                </div>
            </Column>
        </React.Fragment>
    );
};

export default LifetimeStats;