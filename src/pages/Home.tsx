import "../App.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { getCurrentFormattedDate } from "../util/dateUtils.ts";
import { apiGet } from "../api/serverApiCalls.tsx";
import UpcomingEvents from "../components/UpcomingEvents.tsx";
import { EventInput } from "@fullcalendar/core";
import UpcomingEventsLoading from "../components/UpcomingEventsLoading.tsx";
import GenerateRecommendations from "../components/GenerateRecommendations.tsx";
import ChatBot from "../components/ChatBot.tsx";
import Card from "../components/card/Card.tsx";
import Column from "../components/card/Column.tsx";
import UserStats from "../components/UserStats.tsx";
import CardText from "../components/card/CardText.tsx";
import CardList from "../components/card/CardList.tsx";

interface UserRecord {
  name: string;
  streak: number;
  completedExercises: number;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [todaysEvent, setTodaysEvents] = useState<EventInput[]>([])
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserRecord | null>(null);

  useEffect(() => {
    AuthorizedUser(navigate);
    apiGet("/user")
      .then(data => {
        if (data.authorized) {
          setName(data.user.first_name);
          setTodaysEvents(data.user.calendar);
        }
      })
      .catch(error => {
        console.log(error);
        navigate('/login');
      })
      .finally(() => setLoading(false));

    apiGet("/get_user_records")
      .then(response => {
        if (response.authorized && response.user) {
          setUserData({
            name: response.user.name,
            streak: response.user.streak,
            completedExercises: response.user.completedExercises
          });
        } else {
          console.log("No user data returned or not authorized.");
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [navigate]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updates = new FormData(event.currentTarget);
    const status = updates.get("updates");
    if (status) {
      const newStatuses = [status.toString(), ...statuses];
      const updatedStatuses = newStatuses.slice(0, 3); // can limit how many statuses show at once.
      setStatuses(updatedStatuses);
    }
  };

  return (
    <React.Fragment>
      <Navbar />
      <Column>
        <div>
          <Card>
            <CardList>
              <CardText type="header" text={`Welcome, ${name}!`} style={{ marginTop: "0px", marginBottom: "0px" }} />
              <CardText type="title" text={getCurrentFormattedDate()} style={{ marginTop: "0px", marginBottom: "0px" }} />
            </CardList>
          </Card>
          {userData && <UserStats streak={userData.streak} completedExercises={userData.completedExercises} navigate={navigate} />}
        </div>
        <Card>
          <form onSubmit={handleFormSubmit} className="form-row">
            <TextField
              type="text"
              id="updates"
              name="updates"
              fullWidth
              label="What's on your mind?"
              inputProps={{ min: "0", step: "1" }}
              sx={{ marginRight: '16px' }}
            />
            <Button type="submit" variant="contained" color="primary">Post</Button>
          </form>
          <div className="card-info">
            {statuses.map((status, index) => (
              <div key={index} className="posted-status">
                {status}
              </div>
            ))}
          </div>
        </Card>
        <div>
          <GenerateRecommendations />
          {loading ? (<UpcomingEventsLoading />) : (<UpcomingEvents events={todaysEvent} />)}
        </div>
      </Column>
      <ChatBot />
    </React.Fragment>
  );
};

export default Home;