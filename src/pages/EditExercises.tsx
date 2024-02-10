import "../App.css";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../api/serverApiCalls.tsx";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CheckBox from "@mui/material/Checkbox";

const Exercises: React.FC = () => {

    const [exerciseData, setExerciseData] = useState<Object>({});
    const [checkboxStates, setCheckboxStates] = useState<boolean[]>([]);
    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate)
        apiGet('http://localhost:3001/get_exercise_information')
            .then(res => res.json())
            .then(data => {
                setExerciseData(data)
                console.log(data)
                const states: boolean[] = Object.keys(data).map(key => data[key].isEnabled);
                setCheckboxStates(states);
            })
            .catch(error => console.log(error));
    }, [navigate])


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const allExercises = new FormData(event.currentTarget); // Initialize an empty object to store form data
        const formData = {}
        Object.keys(exerciseData).forEach((key) => {
            const exercise = exerciseData[key];
            const isEnabled = allExercises.get(`checkbox${exercise.id}`) === "on" ? true : false
            var timeValue = allExercises.get(`time${exercise.id}`);
            var repsValue = allExercises.get(`reps${exercise.id}`);
            if (timeValue === "" || timeValue === null || timeValue === undefined) {
                timeValue = null;
            }
            if (repsValue === "" || repsValue === null || repsValue === undefined) {
                repsValue = null;
            }

            formData[`${exercise.id}`] = [timeValue, repsValue, isEnabled];

        });

        console.log(formData);

        Object.keys(exerciseData).forEach((key, index) => {
            if (key === "_id") return;
            const exercise = exerciseData[key];
            if (formData[`${index + 1}`][0] !== null) {
                exerciseData[key].values.time = formData[exercise.id][0]
            }
            if (formData[`${index + 1}`][1] !== null) {
                exerciseData[key].values.reps = formData[exercise.id][1]
            }
            exerciseData[key].isEnabled = formData[exercise.id][2]

        });
        console.log(exerciseData)
        const jsonData = JSON.stringify({ exerciseData })
        apiPost('http://localhost:3001/update_exercise_information', jsonData)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("Changes successfully saved.")
                }
            })
            .catch(error => console.log(error));
    };

    const handleCheckboxChange = (index: number) => {
        const newCheckboxStates = [...checkboxStates];
        newCheckboxStates[index] = !newCheckboxStates[index];
        setCheckboxStates(newCheckboxStates);
    };

    const getCardItemComponent = (key: string, exercise: any, index: number) => {
        return (
            <div key={key}>
                <div className="card-item">
                    <div>
                        <CheckBox
                            name={"checkbox" + exercise.id.toString()}
                            defaultChecked={exercise.isEnabled}
                            onChange={() => handleCheckboxChange(index)} />
                    </div>
                    <div className="card-text">
                        {`${exercise.name}: `}
                    </div>
                    <div className="card-button">
                        {exercise.values.time && (
                            <TextField
                                type="number"
                                name={"time" + exercise.id.toString()}
                                label={`Time (s): ${exercise.values.time}`}
                                placeholder={exercise.values.time.toString()}
                                inputProps={{ min: "0", step: "1" }}
                                sx={{ marginRight: '16px', maxWidth: '160px' }}
                                disabled={!checkboxStates[index]}
                            />
                        )}
                        {exercise.values.reps && (
                            <TextField
                                type="number"
                                name={"reps" + exercise.id.toString()}
                                label={`Reps: ${exercise.values.reps}`}
                                placeholder={exercise.values.reps.toString()}
                                inputProps={{ min: "0", step: "1" }}
                                sx={{ marginRight: '16px', maxWidth: '160px' }}
                                disabled={!checkboxStates[index]}
                            />
                        )}
                    </div>
                </div>
                {exercise.id !== 10 && exercise.id !== 19 && <div className="divider" />}
            </div>
        );
    }

    return (
        <React.Fragment>
            <Navbar />
            <form onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-item">
                        <div className="card-text">
                            You have the ability to change any values and enable or disable any items
                        </div>
                        <div className="card-button">
                            <Button type="submit" variant="contained" color="primary">Submit</Button>
                        </div>
                    </div>
                </div>
                <div className="exercise-columns">
                    <div className="exercise-column">
                        <div className="card">
                            <div className="card-list">
                                {Object.keys(exerciseData).map((key, index) => {
                                    const exercise = exerciseData[key];
                                    if (exercise.id <= 10) {
                                        return getCardItemComponent(key, exercise, index)
                                    } else {
                                        return null;
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="exercise-column">
                        <div className="card">
                            <div className="card-list">
                                {Object.keys(exerciseData).map((key, index) => {
                                    const exercise = exerciseData[key];
                                    if (exercise.id > 10) {
                                        return getCardItemComponent(key, exercise, index)
                                    } else {
                                        return null;
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </React.Fragment>
    )
}

export default Exercises;
