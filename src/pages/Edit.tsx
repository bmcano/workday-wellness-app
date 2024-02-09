import "../App.css";
import React, { useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
const points = [
    {
      id: 'neck',
      title: 'Neck Stretches',
      subPoints: [
        { id: 'flexion', title: 'Neck flexion and extension',value: 1},
        { id: 'retraction', title: 'Neck retraction',value: 1 },
        { id: 'rotation', title: 'Neck Rotation',value: 1 },
      ],
    },
    {
      id: 'back',
      title: 'Back Stretches',
      subPoints: [
        { id: 'figure', title: 'On the ground figure four',value: 1},
        { id: 'twist', title: 'Spinal Twist',value: 1 },
        { id: 'rolls', title: 'Shoulder Rolls',value: 1 },
        { id: 'abduction', title: 'Horizontal abduction',value: 1},
        { id: 'lower', title: 'Seated lower back',value: 1 },
        { id: 'reminder', title: 'Posture Reminder',value: 1},
      ],
    },
    {
        id: 'wrist',
        title: 'Wrist Stretches',
        subPoints: [
          { id: 'wristrolls', title: 'Wrist Rolls',value: 1},
          { id: 'palm', title: 'Finger to Palm',value: 1},
        ],
      },
      {
        id: 'movement',
        title: 'Movement Exercises',
        subPoints: [
          { id: 'squat', title: 'Squats',value: 1 },
          { id: 'lunge', title: 'Lunges',value: 1},
          { id: 'jacks', title: 'Jumping Jacks',value: 1 },
          { id: 'push', title: 'Push ups',value: 1},
          { id: 'walk', title: 'Walks',value: 1 },
        ],
      },
  ];

const Exercises: React.FC = () => {
    //const [exercisePoints, setExercisePoints] = useState<{ [key: number]: number }>({});

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const allExercises = new FormData(event.currentTarget);
        const flexion = allExercises.get('flexion');
        const retraction = allExercises.get('retraction');
        const rotation = allExercises.get('rotation');
        const figure = allExercises.get('figure');
        const twist = allExercises.get('twist');
        const rolls = allExercises.get('rolls');
        const abduction = allExercises.get('abduction');
        const lower = allExercises.get('lower');
        const reminder = allExercises.get('reminder');
        const wristrolls = allExercises.get('wristrolls');
        const palm = allExercises.get('palm');
        const squat = allExercises.get('squat');
        const lunge = allExercises.get('lunge');
        const jacks = allExercises.get('jacks');
        const push = allExercises.get('push');
        const walk = allExercises.get('walk');
        const jsonData = JSON.stringify({flexion,retraction,rotation,figure,twist,rolls,abduction,lower,reminder,wristrolls,palm,squat,lunge,jacks,push,walk});
        console.log(jsonData);
    };

    return (
        <React.Fragment>
            <Navbar />
            <h1>Exercises Page</h1>
            <form onSubmit={handleSubmit}>
                {points.map((point) => (
                    <div key={point.id}>
                        <h2>{point.title}</h2>
                        <ul>
                            {point.subPoints.map((subPoint) => (
                                <li key={subPoint.id}>
                                    {subPoint.title}{' '}
                                    <input
                                        type="number"
                                        name={subPoint.id}
                                        placeholder={subPoint.value.toString()}
                                        min="0"
                                        step="1"
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </React.Fragment>
    )
}

export default Exercises
