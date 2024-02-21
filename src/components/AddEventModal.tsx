import { EventInput } from '@fullcalendar/core'
import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { apiPost } from '../api/serverApiCalls.tsx';
import { format } from 'date-fns';
import { formatDateforDatabase } from '../util/dateUtils.ts';
import { getExerciseMenuList } from '../util/getExerciseMenuList.ts';

Modal.setAppElement('#root');

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (eventData: EventInput) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onSave }) => {
    const [selectedItem, setSelectedItem] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const exercises = getExerciseMenuList();

    const handleSave = () => {
        const eventData: EventInput = {
            title: selectedItem,
            start: formatDateforDatabase(startDate),
            end: formatDateforDatabase(endDate)
        };

        // save to database first
        const jsonData = JSON.stringify({ event: eventData })
        apiPost('http://localhost:3001/add_calendar_data', jsonData)
            .catch(error => console.log(error));
        // TODO - check if outlook client is synced, if so, add the event to outlook, otherwise do nothing
        onSave(eventData);
        onClose();
    };

    const customModalStyle = {
        content: {
            width: '50%',
            margin: 'auto',
            maxHeight: '80%',
            overflow: 'auto',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            border: 'none',
            background: 'none'
        },
        overlay: {
            zIndex: 99, // this ensures the overlay is over all other components
        },
    };

    const marginTLR = { marginTop: '16px', marginLeft: '16px', marginRight: '16px' }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Add Event Modal"
            style={customModalStyle} // Apply custom style to the modal
        >
            <div className='card'>
                <div className='card-list'>
                    <p className="card-header-text">Add Event</p>
                    <div className='card-item'>
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
                                    <MenuItem value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='card-item' style={marginTLR}>
                        <div className='card-text'>Start Date:</div>
                        <div className='card-button'>
                            <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} showTimeSelect dateFormat="Pp" />
                        </div>
                    </div>
                    <div className='card-item' style={marginTLR}>
                        <div className='card-text'>End Date:</div>
                        <div className='card-button'>
                            <DatePicker selected={endDate} onChange={(date: Date) => setEndDate(date)} showTimeSelect dateFormat="Pp" />
                        </div>
                    </div>
                    <div className='divider' style={marginTLR} />
                    <div className='card-item' style={{ marginTop: '16px' }}>
                        <div className='card-button'>
                            <Button variant="text" color="primary" onClick={handleSave}>Save</Button>
                            <Button variant="text" onClick={onClose}>Cancel</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddEventModal;