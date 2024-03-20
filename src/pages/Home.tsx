import "../App.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
// @ts-ignore
import messageSound from '../static/sounds/popcorn.mp3'
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { getCurrentFormattedDate } from "../util/dateUtils.ts";
import { apiGet } from "../api/serverApiCalls.tsx";
import UpcomingEvents from "../components/UpcomingEvents.tsx";
import { EventInput } from "@fullcalendar/core";
import UpcomingEventsLoading from "../components/UpcomingEventsLoading.tsx";
import GenerateRecommendations from "../components/GenerateRecommendations.tsx";
import Footer from "../components/Footer.tsx";

let intervalId: number | null = null;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const audioRef = new Audio(messageSound);

  const [name, setName] = useState("");
  const [duration, setDuration] = useState<number>(60);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [todaysEvent, setTodaysEvents] = useState<EventInput[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthorizedUser(navigate);
    apiGet("/user")
      .then(data => {
        if (data.authorized) {
          console.log(data)
          setName(data.user.first_name);
          setTodaysEvents(data.user.calendar);
        }
      })
      .catch(error => {
        console.log(error);
        navigate('/login');
      })
      .finally(() => setLoading(false));
    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (intervalId !== null) clearInterval(intervalId);
    };
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

  const startTimer = () => {
    // Attempt to query the DOM elements
    const timerElapsed = document.querySelector(".timer__path-elapsed") as SVGCircleElement | null;
    const timerProgress = document.querySelector(".timer__path-remaining") as SVGPathElement | null;

    if (!timerElapsed || !timerProgress) {
      console.error('SVG elements not found!');
      return;
    }

    if (intervalId !== null) clearInterval(intervalId);
    setElapsedTime(duration);
    intervalId = setInterval(() => {
      setElapsedTime((prevTime) => {
        const newTime = prevTime - 1;
        const percentage = (newTime / duration) * 100;
        timerElapsed.style.strokeDashoffset = (283 - (283 * percentage) / 100).toString();
        timerProgress.style.strokeDashoffset = (283 - (283 * percentage) / 100).toString();

        if (newTime <= 0) {
          clearInterval(intervalId as number);
          audioRef.play();
          intervalId = null;
        }

        return newTime;
      });
    }, 1000) as unknown as number;
  };

  return (
    <React.Fragment>
      <Navbar />
      <div className="card">
        <div className="card-item">
          <p className="card-header-text">Welcome, {name}!</p>
          <p className="card-right-text">{getCurrentFormattedDate()}</p>
        </div>
      </div>
      <div className="card-columns">
        <div className="card-column">
          <div className="timer-card">
            <div className="timer">
              <div className="timer__circle">
                <svg className="timer__svg" viewBox="0 0 100 100">
                  <g className="timer__circle-track">
                    <circle className="timer__path-elapsed" strokeDasharray="283" d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"></circle>
                  </g>
                  <g className="timer__circle-progress">
                    <path className="timer__path-remaining" strokeDasharray="283" d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"></path>
                  </g>
                </svg>
              </div>
              <div className="timer__label">
                <div className="card-item">
                  <TextField
                    type="number"
                    id="timer"
                    onChange={(e) => setDuration(Number(e.target.value))}
                    value={duration.toString()}
                    inputProps={{ min: "0", step: "1" }}
                    sx={{ marginRight: '16px' }}
                  />
                  <Button variant="contained" color="primary" onClick={startTimer}>Start</Button>
                </div>

                <span className="timer__time">
                  {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:
                  {(elapsedTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="card-column">
          <div className="card">
            <form onSubmit={handleFormSubmit} className="card-item">
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
          </div>
        </div>
        <div className="card-column">
          <GenerateRecommendations />
          {loading ? (<UpcomingEventsLoading />) : (<UpcomingEvents events={todaysEvent} />)}
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Home;