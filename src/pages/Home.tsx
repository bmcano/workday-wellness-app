import "../App.css";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.tsx";
import { handleLogout } from '../api/Logout.tsx';
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";

let intervalId: number | null = null; // Explicitly stating that intervalId can be a number or null


const Home: React.FC = () => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState<number>(60);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    AuthorizedUser(navigate);

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, [navigate]);

  const logout = () => {
    handleLogout(navigate);
  };

  const startTimer = () => {
    // Attempt to query the DOM elements
    const timerElapsed = document.querySelector(".timer__path-elapsed") as SVGCircleElement | null;
    const timerProgress = document.querySelector(".timer__path-remaining") as SVGPathElement | null;
  
    // Ensure elements exist before continuing
    if (!timerElapsed || !timerProgress) {
      console.error('SVG elements not found!');
      return;
    }
  
    // Clear any existing interval
    if (intervalId !== null) clearInterval(intervalId);
  
    // Set the initial elapsed time to the duration
    setElapsedTime(duration);
  
    intervalId = setInterval(() => {
      setElapsedTime((prevTime) => {
        const newTime = prevTime - 1;
        const percentage = (newTime / duration) * 100;
  
        // Now we can safely update the style
        timerElapsed.style.strokeDashoffset = (283 - (283 * percentage) / 100).toString();
        timerProgress.style.strokeDashoffset = (283 - (283 * percentage) / 100).toString();
  
        // When elapsed time reaches 0, clear the interval
        if (newTime <= 0) {
          clearInterval(intervalId as number);
          intervalId = null;
        }
  
        return newTime;
      });
    }, 1000) as unknown as number;
  };
  

  return (
    <React.Fragment>
      <Navbar />
      <h1>Home</h1>
      <div className="timer">
        <div className="timer__circle">
        <svg className="timer__svg" viewBox="0 0 100 100">
        <g className="timer__circle-track">
            <circle className="timer__path-elapsed" stroke-dasharray="283" d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"></circle>
        </g>
        <g className="timer__circle-progress">
            <path className="timer__path-remaining" stroke-dasharray="283"  d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"></path>
        </g>
        </svg>
        </div>
        <div className="timer__label">
          <input
            type="number"
            value={duration.toString()}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
          <button onClick={startTimer}>Start</button>
          <span className="timer__time">
            {Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:
            {(elapsedTime % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      <Link to="#/" onClick={logout}>Logout</Link>
    </React.Fragment>
  );
};

export default Home;