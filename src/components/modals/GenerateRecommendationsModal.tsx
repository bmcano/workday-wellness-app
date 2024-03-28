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
import Divider from '../card/Divider.tsx';
import Card from '../card/Card.tsx';
import CardList from '../card/CardList.tsx';
import CardText from '../card/CardText.tsx';
import Column from '../card/Column.tsx';
import CardRow from '../card/CardRow.tsx';

Modal.setAppElement("#root");

interface TimeSlots {
    start: Date,
    end: Date
}

const GenerateRecommendationsModal: React.FC<GenerateRecommendationsModalProps> = ({ isOpen, onClose, onSave }) => {
    const [date, setDate] = useState(new Date());
    const [intensity, setIntensity] = useState('low');
    const [events, setEvents] = useState<EventInput[]>([])
    const [exerciseData, setExerciseData] = useState<ExerciseCategories>({ neck: [], back: [], wrist: [], exercise: [], misc: [] });

    useEffect(() => {
        apiGet("/user")
            .then(data => {
                if (data.authorized) {
                    setEvents(data.user.calendar)
                    const categories = splitExerciseData(data.user.exercises);
                    setExerciseData(categories);
                }
            })
            .catch(error => console.log(error));
    }, [])

    const handleGenerate = () => {
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
        applyExercises(exerciseData.exercise.slice(), mode, exercises)
        splitUpStretches(mode, exerciseData.back.slice(), exerciseData.neck.slice(), exerciseData.wrist.slice(), exercises)
        splitUpMisc(exerciseData.misc.slice(), mode, exercises)
        // pair recommendations within an even(ish) intervals between them during free time slots
        const newEvents = distributeEvents(freeTime as unknown as TimeSlots[], exercises);
        console.log(newEvents);
        setEvents(newEvents);
    };
    const handleAccept = () => {
        // Save generated exercises to the database
        const jsonData = JSON.stringify({ events: events })
        apiPost('/add_user_recommendations', jsonData)
            .then(() => {
                setEvents([]);
            })
            .catch(error => console.log(error));

        onSave(events);
        onClose();
    };

    const handleClose = () => {
        setEvents([]);
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Generate Exercise Recommendations"
            style={customModalStyle}
        >
            <Card>
                <CardList>
                    <CardText type="header" text="Generate Exercise Recommendations" style={{ marginLeft: '16px' }} />
                    <Column>
                        <CardList style={marginTLR}>
                            <CardText type="title" text="Select intensity:" />
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
                        </CardList>
                        <CardList style={marginTLR}>
                            <CardText type="title" text="Select date:" />
                            <div className='first-item-row'>
                                <DatePicker selected={date} onChange={(date: Date) => setDate(date)} dateFormat="P" />
                            </div>
                        </CardList>
                    </Column>


                    <Divider style={dividerMargin} />
                    {events.length === 0 &&
                        <CardRow>
                            <div className='card-button'>
                                <Button variant="text" color="primary" onClick={handleGenerate}>Generate</Button>
                                <Button variant="text" onClick={handleClose}>Cancel</Button>
                            </div>
                        </CardRow>}
                    {events.length > 0 && (
                        <div>
                            <CardRow>
                                <ul>
                                    {events.map((event, index) => (
                                        <p key={index}>{event.title}</p>
                                    ))}
                                </ul>
                            </CardRow>
                            <CardRow>
                                <div className='card-button'>
                                    <Button variant="text" onClick={handleAccept}>Accept</Button>
                                    <Button variant="text" onClick={handleGenerate}>Regenerate</Button>
                                    <Button variant="text" onClick={handleClose}>Cancel</Button>
                                </div>
                            </CardRow>
                        </div>
                    )}
                </CardList>
            </Card>
        </Modal>
    );
};

export default GenerateRecommendationsModal;