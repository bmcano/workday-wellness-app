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
        { id: 1, title: 'Neck flexion and extension', youtubeURL: 'https://www.youtube.com/watch?v=6k9VQNN8B5U' },
        { id: 2, title: 'Neck retraction', youtubeURL: 'https://www.youtube.com/watch?v=cncV6CTVvkM' },
        { id: 3, title: 'Neck Rotation', youtubeURL: 'https://www.youtube.com/watch?v=ZgeO87_VFog' },
      ],
    },
    {
      id: 2,
      title: 'Back Stretches',
      subPoints: [
        { id: 1, title: 'On the ground figure four', youtubeURL: '' },
        { id: 2, title: 'Sinal Twist', youtubeURL: 'https://www.youtube.com/shorts/sI44ZU33DjA' },
        { id: 3, title: 'Shoulder Rolls', youtubeURL: 'https://www.youtube.com/watch?v=IKJZL4hvppw' },
        { id: 4, title: 'Horizontal abduction', youtubeURL: 'https://www.youtube.com/watch?v=UoJO2B5cAPg' },
        { id: 5, title: 'Seated lower back', youtubeURL: 'https://www.youtube.com/watch?v=oi4Dq7uZfEg' },
        { id: 6, title: 'Posture Reminder', youtubeURL: '' },
      ],
    },
    {
        id: 3,
        title: 'Wrist Stretches',
        subPoints: [
          { id: 1, title: 'Wrist Rolls', youtubeURL: 'https://www.youtube.com/watch?v=nAiWIrRICFE' },
          { id: 2, title: 'Finger to Palm', youtubeURL: 'https://www.youtube.com/watch?v=cOYA0cTIwzM' },
        ],
      },
      {
        id: 4,
        title: 'Movement Exercises',
        subPoints: [
          { id: 1, title: 'Squats', youtubeURL: 'https://www.youtube.com/watch?v=xqvCmoLULNY' },
          { id: 2, title: 'Lunges', youtubeURL: 'https://www.youtube.com/watch?v=MxfTNXSFiYI' },
          { id: 3, title: 'Jumping Jacks', youtubeURL: 'https://www.youtube.com/watch?v=iSSAk4XCsRA' },
          { id: 4, title: 'Push ups', youtubeURL: 'https://www.youtube.com/watch?v=JyCG_5l3XLk' },
          { id: 5, title: 'Walks', youtubeURL: '' },
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
                            <li key={subPoint.id}>
                            {subPoint.title}{' '}
                            <a
                              href={subPoint.youtubeURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              >
                                Link
                                </a>
                            </li>
                         ))}
                    </ul>
                </div>
            ))}
        </React.Fragment>
    )
}

export default Exercises