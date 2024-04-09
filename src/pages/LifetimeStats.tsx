import "../App.css";
import React, { useEffect, useState } from 'react';
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api/serverApiCalls.tsx";
import Navbar from "../components/Navbar.tsx";
import Card from "../components/card/Card.tsx";
import Column from "../components/card/Column.tsx";
import CardText from "../components/card/CardText.tsx"

const LifetimeStats: React.FC = () => {
    

    return (
        <React.Fragment>
            <Navbar />
            <Column>
                <div>
                    <Card>
                        <CardText type="header" text="Lifetime Stats:" style={{ marginTop: "0px", marginBottom: "0px" }} />
                        <p>Coming soon...</p>
                    </Card>
                </div>
            </Column>
        </React.Fragment>
    );
};

export default LifetimeStats;