import { EventInput } from '@fullcalendar/core'
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { apiPost, apiGet } from '../../api/serverApiCalls.tsx';
import { customModalStyle, dividerMargin, marginTLR } from './modalStyles.ts';
import { GenerateRecommendationsModalProps } from './OpenSaveCloseModalProps.ts';
import { getFreeTimeSlots } from '../../util/convertOutlookPayload.ts';
import { applyExercises, getModeValues, splitExerciseData, splitUpMisc, splitUpStretches } from '../../util/exerciseReccomendations.ts';
import { ExerciseCategories } from '../../types/ExerciseCategories.ts';
import { distributeEvents } from '../../util/distributeEvents.ts';
import { getServerCall } from '../../util/getFullAppLink.ts';

Modal.setAppElement("#root")

interface TimeSlots {
    start: Date,
    end: Date
}

const GenerateRecommendationsModal: React.FC<GenerateRecommendationsModalProps> = ({ isOpen, onClose, onSave }) => {
    const [date, setDate] = useState(new Date());
    const [intensity, setIntensity] = useState('low');
    const [events, setEvents] = useState<EventInput[]>([])
    const [exerciseData, setExerciseData] = useState<ExerciseCategories>({ neck: [], back: [], wrist: [], exercise: [], misc: [] });
    //const [generatedExercises, setGeneratedExercises] = useState<string[]>([]); // State to hold generated exercises

    useEffect(() => {
        apiGet(getServerCall("/user"))
            .then(res => res.json())
            .then(data => {
                if (data.authorized) {
                    setEvents(data.user.calendar)
                    const categories = splitExerciseData(data.user.exercises);
                    console.log(categories);
                    setExerciseData(categories);
                }
            })
            .catch(error => console.log(error));
    }, [])

    const handleSave = () => {
        // get events from selected date
        // const dayAbbreviation = date.toLocaleString('en-us', { weekday: 'short' });
        const isoDate = date.toISOString().split('T')[0];
        const updatedEvents = events.filter(event => event.start?.toString().startsWith(isoDate));
        console.log(updatedEvents)
        // get free time for selected date
        const freeTime = getFreeTimeSlots(updatedEvents)
        console.log(freeTime);
        // get recommendations from intensity level
        const exercises: string[] = [];
        const mode = getModeValues(intensity);
        applyExercises(exerciseData.exercise, mode, exercises)
        splitUpStretches(mode, exerciseData.back, exerciseData.neck, exerciseData.wrist, exercises)
        splitUpMisc(exerciseData.misc, mode, exercises)
        console.log(exercises)
        //setGeneratedExercises(exercises)
        // pair recommendations within an even(ish) intervals between them during free time slots
        const newEvents = distributeEvents(freeTime as unknown as TimeSlots[], exercises);
        console.log(newEvents);
        setEvents(newEvents);

        // TODO:
        // list events
        // accept/decline
        // if accept: send them all to the database/outlook 
        // if decline: regenerate items

        // save to database first
        // const jsonData = JSON.stringify({ events: newEvents })
        // apiPost(getServerCall('/add_user_recommendations'), jsonData)
        //     .catch(error => console.log(error));

        // onSave(newEvents);
        // onClose();
    };
    const handleAccept = () => {
        // Save generated exercises to the database
        const jsonData = JSON.stringify({ events: events })
            apiPost(getServerCall('/add_user_recommendations'), jsonData)
            .catch(error => console.log(error));

        onSave(events);
        onClose();
    };

    const handleDecline = () => {
        // Regenerate exercises
        handleSave();
    };
    



    
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Generate Exercise Recommendations"
            style={customModalStyle}
        >
            <div className='card'>
                <div className='card-list'>
                    <p className="card-header-text">Generate Exercise Recommendations</p>
                    <div className='card-columns'>
                        <div className='card-column'>
                            <div className='card-list' style={marginTLR}>
                                <div className='card-title-text' style={marginTLR}>Select intensity:</div>
                                <RadioGroup
                                    aria-label="intensity"
                                    name="intensity"
                                    value={intensity}
                                    onChange={(e) => setIntensity(e.target.value)}
                                    style={marginTLR}
                                >
                                    <FormControlLabel value="low" control={<Radio />} label="Low" />
                                    <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                                    <FormControlLabel value="high" control={<Radio />} label="High" />
                                </RadioGroup>
                            </div>
                        </div>
                        <div className='card-column'>
                            <div className='card-list' style={marginTLR}>
                                <div className='card-title-text' style={{ marginLeft: "16px", marginBottom: "16px" }}>Select date:</div>
                                <div className='card-text'>
                                    <DatePicker selected={date} onChange={(date: Date) => setDate(date)} dateFormat="P" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='divider' style={dividerMargin} />
                    <div className='card-item' style={{ marginTop: '16px' }}>
                        <div className='card-button'>
                            <Button variant="text" color="primary" onClick={handleSave}>Generate</Button>
                            <Button variant="text" onClick={onClose}>Cancel</Button>
                        </div>
                    </div>

                    {/* Display generated exercises with accept and decline buttons */}
                    {events.length > 0 && (
                        <div className='card-item'>
                            <p>Generated Exercises:</p>
                            <ul>
                                {events.map((event, index) => (
                                    <li key={index}>{event.title}</li>
                                ))}
                            </ul>
                            <div className='card-button'>
                                <Button variant="contained" color="primary" onClick={handleAccept}>Accept</Button>
                                <Button variant="contained" onClick={handleDecline}>Decline</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default GenerateRecommendationsModal;