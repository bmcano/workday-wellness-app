import "../App.css";
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";

const points = [
    {
      id: 1,
      title: 'Neck Stretches',
      subPoints: [
        { id: 1, title: 'Neck flexion and extension' },
        { id: 2, title: 'Neck retraction' },
        { id: 3, title: 'Neck Rotation' },
      ],
    },
    {
      id: 2,
      title: 'Back Stretches',
      subPoints: [
        { id: 1, title: 'On the ground figure four' },
        { id: 2, title: 'Hands on hip' },
        { id: 3, title: 'Shoulder Rolls' },
        { id: 4, title: 'Horizontal abduction' },
        { id: 5, title: 'Posture Reminder' },
      ],
    },
    {
        id: 3,
        title: 'Wrist Stretches',
        subPoints: [
          { id: 1, title: 'Wrist Rolls' },
          { id: 2, title: 'Finger to Palm' },
        ],
      },
      {
        id: 4,
        title: 'Movement Exercises',
        subPoints: [
          { id: 1, title: 'Squats' },
          { id: 2, title: 'Lunges' },
          { id: 3, title: 'Jumping Jacks' },
          { id: 4, title: 'Push ups' },
          { id: 5, title: 'Walks' },
        ],
      },
  ];
const Exercises: React.FC = () => {
    return (
        <React.Fragment>
            <Navbar />
            <h1>Exercises Page</h1>
            {points.map((point) => (
                <div key={point.id}>
                    <h2>{point.title}</h2>
                    <ul>
                        {point.subPoints.map((subPoint) => (
                            <li key={subPoint.id}>{subPoint.title}</li>
                         ))}
                    </ul>
                </div>
            ))}
        </React.Fragment>
    )
}

export default Exercises