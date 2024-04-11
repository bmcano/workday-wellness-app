import { EventInput } from '@fullcalendar/core'
import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { apiPost } from '../../api/serverApiCalls.tsx';
import { formatDateforDatabase } from '../../util/dateUtils.ts';
import { getExerciseMenuList } from '../../util/getExerciseMenuList.ts';
import { customModalStyle, dividerMargin, marginTLR } from './modalStyles.ts';
import { AddEventModalProps } from './OpenSaveCloseModalProps.ts';
import Divider from '../card/Divider.tsx';
import Card from '../card/Card.tsx';
import CardText from '../card/CardText.tsx';
import CardList from '../card/CardList.tsx';
import CardRow from '../card/CardRow.tsx';

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onSave }) => {
    const [selectedItem, setSelectedItem] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [recurrencePattern, setRecurrencePattern] = useState('');
    const [endDate, setEndDate] = useState(new Date());

    const exercises = getExerciseMenuList();

    const handleSave = () => {
        const end = new Date(startDate);
        end.setMinutes(end.getMinutes() + 5);
        const eventData: EventInput = {
            title: selectedItem,
            start: formatDateforDatabase(startDate),
            end: formatDateforDatabase(end),
            isExercise: true,
            recurrence: recurrencePattern,
            endRecurrence: formatDateforDatabase(endDate)
        };

        // save to database first
        const jsonData = JSON.stringify({ event: eventData })
        apiPost("/add_calendar_data", jsonData).catch(error => console.log(error));
        // then save to the users outlook calendar, if not synced nothing will happen
        apiPost("/add_outlook_event", jsonData).catch(error => console.log(error));
        onSave(eventData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Add Event Modal"
            style={customModalStyle}
        >
            <Card isModal={true}>
                <CardList>
                    <CardText type="header" text="Add Event" style={{ marginLeft: '16px' }} />
                    <CardRow>
                        <FormControl fullWidth style={{ marginLeft: '16px', marginRight: '16px' }}>
                            <InputLabel id="select-item-label">Select Item</InputLabel>
                            <Select
                                labelId="select-event-label"
                                id="select-event"
                                label="Select Item"
                                value={selectedItem}
                                fullWidth
                                onChange={(e) => setSelectedItem(e.target.value as string)}
                            >
                                <MenuItem value=""><em>Select Item</em></MenuItem>
                                {exercises.map(item => (
                                    <MenuItem key={item} value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </CardRow>
                    <CardRow style={marginTLR}>
                        <CardText type="title" text="Date and time:" style={{ marginLeft: "16px", marginTop: "0px", marginBottom: "0px" }} />
                    </CardRow>
                    <CardRow style={marginTLR}>
                        <div className='first-item-row'>
                            <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} showTimeSelect dateFormat="Pp" />
                        </div>
                    </CardRow>
                    <CardRow style={marginTLR}>
                        <FormControl fullWidth style={{ marginTop: '16px' }}>
                            <InputLabel id="select-item-label">Reccurrence</InputLabel>
                            <Select
                                labelId="recurrencePattern"
                                id="recurrencePattern"
                                label="Reccurrence"
                                value={recurrencePattern}
                                fullWidth
                                onChange={(e) => setRecurrencePattern(e.target.value as string)}
                            >
                                <MenuItem value=""><em>Does not repeat</em></MenuItem>
                                <MenuItem value="daily">Daily</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                            </Select>
                        </FormControl>
                    </CardRow>
                    <CardRow style={marginTLR}>
                        <CardText type="title" text="End date:" style={{ marginLeft: "16px", marginTop: "0px", marginBottom: "0px" }} />
                    </CardRow>
                    <CardRow style={marginTLR}>
                        <div className='first-item-row'>
                            <DatePicker selected={endDate} onChange={(date: Date) => setEndDate(date)} dateFormat="P" disabled={!recurrencePattern}/>
                        </div>
                    </CardRow>
                    <Divider style={dividerMargin} />
                    <CardRow>
                        <div className='card-button'>
                            <Button variant="text" color="primary" onClick={handleSave}>Save</Button>
                            <Button variant="text" onClick={onClose}>Cancel</Button>
                        </div>
                    </CardRow>
                </CardList>
            </Card>
        </Modal>
    );
};

export default AddEventModal;