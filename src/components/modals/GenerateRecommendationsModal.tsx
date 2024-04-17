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
import { convertToLocaleISOString } from '../../util/dateUtils.ts';
import { getWorkHours } from '../../util/getWorkHours.ts';

Modal.setAppElement("#root");

interface TimeSlots {
    start: Date,
    end: Date
}

const GenerateRecommendationsModal: React.FC<GenerateRecommendationsModalProps> = ({ isOpen, onClose, onSave }) => {
    const [date, setDate] = useState(new Date());
    const [intensity, setIntensity] = useState('low');
    const [events, setEvents] = useState<EventInput[]>([])
    const [recEvents, setRecEvents] = useState<EventInput[]>([])
    const [exerciseData, setExerciseData] = useState<ExerciseCategories>({ neck: [], back: [], wrist: [], exercise: [], misc: [] });
    const [workHours, setWorkHours] = useState({
        Monday: { start: '08:00', end: '17:00' },
        Tuesday: { start: '08:00', end: '17:00' },
        Wednesday: { start: '08:00', end: '17:00' },
        Thursday: { start: '08:00', end: '17:00' },
        Friday: { start: '08:00', end: '17:00' }
    });

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

        apiGet("/schedule")
            .then(data => {
                if (data.authorized) {
                    const schedule = data.schedule;
                    setWorkHours({
                        Monday: { start: schedule.monday_start, end: schedule.monday_end },
                        Tuesday: { start: schedule.tuesday_start, end: schedule.tuesday_end },
                        Wednesday: { start: schedule.wednesday_start, end: schedule.wednesday_end },
                        Thursday: { start: schedule.thursday_start, end: schedule.thursday_end },
                        Friday: { start: schedule.friday_start, end: schedule.friday_end }
                    })
                } else {
                    console.log("Using default schedule.");
                }
            })
            .catch(error => console.log(error));
    }, [])

    const handleGenerate = () => {
        // get events from selected date
        const selectedDate = convertToLocaleISOString(date);
        const updatedEvents = events.filter(event => event.start?.toString().startsWith(selectedDate));
        // get free time for selected date
        const hours = getWorkHours(date.getDay(), workHours);
        const freeTime = getFreeTimeSlots(updatedEvents, hours.start, hours.end, selectedDate);
        // get recommendations from intensity level
        const exercises: string[] = [];
        const mode = getModeValues(intensity);
        applyExercises(exerciseData.exercise.slice(), mode, exercises)
        splitUpStretches(mode, exerciseData.back.slice(), exerciseData.neck.slice(), exerciseData.wrist.slice(), exercises)
        splitUpMisc(exerciseData.misc.slice(), mode, exercises)
        // pair recommendations within an even(ish) intervals between them during free time slots
        const newEvents = distributeEvents(freeTime as unknown as TimeSlots[], exercises);
        setRecEvents(newEvents);
    };

    const handleAccept = () => {
        const jsonData = JSON.stringify({ events: recEvents })
        apiPost('/add_user_recommendations', jsonData)
            .then(() => {
                setRecEvents([]);
            })
            .catch(error => console.log(error));

        onSave(recEvents);
        onClose();
    };

    const handleClose = () => {
        setRecEvents([]);
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Generate Exercise Recommendations"
            style={customModalStyle}
        >
            <Card isModal={true}>
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
                    {recEvents.length === 0 &&
                        <CardRow>
                            <div className='card-button'>
                                <Button variant="text" color="primary" onClick={handleGenerate}>Generate</Button>
                                <Button variant="text" onClick={handleClose}>Cancel</Button>
                            </div>
                        </CardRow>}
                    {recEvents.length > 0 && (
                        <div>
                            <CardRow>
                                <ul>
                                    {recEvents.map((event, index) => (
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