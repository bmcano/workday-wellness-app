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

let intervalId: number | null = null;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const audioRef = new Audio(messageSound);

  const [name, setName] = useState("");
  const [duration, setDuration] = useState<number>(60);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [todaysEvent, setTodaysEvents] = useState<EventInput[]>([])

  useEffect(() => {
    AuthorizedUser(navigate);
    apiGet('http://localhost:3001/get_user')
      .then(res => res.json())
      .then(data => {
        if (data.authorized) {
          setName(data.user.first_name);
          setTodaysEvents(data.user.calendar);
        }
      })
      .catch(error => console.log(error));
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
                    <circle className="timer__path-elapsed" stroke-dasharray="283" d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"></circle>
                  </g>
                  <g className="timer__circle-progress">
                    <path className="timer__path-remaining" stroke-dasharray="283" d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"></path>
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
          <div>
            <UpcomingEvents events={todaysEvent} />
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: `<iframe id="UTUFTPWDEN" loading="eager" src="https://embed.pickaxeproject.com/axe?id=Workday_Wellness_Assistant_LGKZX&mode=embed_gold&host=beta&theme=custom&opacity=100&font_header=Real+Head+Pro&size_header=30&font_body=Real+Head+Pro&size_body=16&font_labels=Real+Head+Pro&size_labels=14&font_button=Real+Head+Pro&size_button=16&c_fb=&c_ff=F01716&c_fbd=F01716&c_bb=F01716&c_bt=FFFFFF&c_t=000000&s_ffo=100&s_bbo=100&s_f=minimalist&s_b=filled&s_t=2&s_to=1&s_r=2" width="100%" height="500px" onMouseOver="this.style.boxShadow='0px 6px 6px -3px rgba(0,0,0,0.1)'" onMouseOut="this.style.boxShadow='none'" style="border:1px solid rgba(0, 0, 0, 1);transition:.3s;border-radius:4px;" frameBorder="0"></iframe>`
            }}
          ></div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;