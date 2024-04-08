import "../App.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { getCurrentFormattedDate } from "../util/dateUtils.ts";
import { apiGet, apiPost } from "../api/serverApiCalls.tsx";
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

interface FriendStatus {
  email: string;
  status: string;
  timestamp: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [todaysEvent, setTodaysEvents] = useState<EventInput[]>([])
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserRecord | null>(null);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [statusStrings, setStatusStrings] = useState([]);
  const [friendStatuses, setFriendStatuses] = useState<FriendStatus[]>([]);


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


    apiGet("/get_friend_status")
      .then(response => {
        if (response.success && response.friendsStatuses) {
          // Make sure that the response is in the shape of FriendStatus[]
          setFriendStatuses(response.friendsStatuses as FriendStatus[]);
        } else {
          console.error("Failed to retrieve friends' statuses");
        }
      })
      .catch(error => {
        console.error("Error fetching friends' statuses:", error);
      });

  }, [navigate]);


  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status) {
      const jsonData = JSON.stringify({ status: status });

      apiPost('/status', jsonData)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            setStatuses(previousStatuses => [status, ...previousStatuses].slice(0, 3));
            setStatus('');
            console.log('Status updated:', data);
          } else {
            console.error('Status update failed:', data.message);
          }
        })
        .catch((error) => {
          console.error('Error submitting status:', error);
        });
    } else {
      console.error('No status text provided');
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
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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

          <div className="friend-statuses">
            {friendStatuses.map((friendStatus, index) => {
              const readableTimestamp = new Date(friendStatus.timestamp).toLocaleString();
              return (
                <div key={index} className="friend-status-card">
                  <div className="friend-status-name">{friendStatus.email.split('@')[0]}</div>
                  <div className="friend-status-message">Status: {friendStatus.status}</div>
                  <div className="friend-status-timestamp">{readableTimestamp}</div>
                </div>
              );
            })}
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