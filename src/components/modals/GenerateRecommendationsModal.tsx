import { EventInput } from '@fullcalendar/core'
import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, FormControlLabel, Radio, RadioGroup } from '@mui/material';
// import { apiPost } from '../../api/serverApiCalls.tsx';
import { formatDateforDatabase } from '../../util/dateUtils.ts';
// import { getExerciseMenuList } from '../../util/getExerciseMenuList.ts';
import { customModalStyle, dividerMargin, marginTLR } from './modalStyles.ts';
import { GenerateRecommendationsModalProps } from './OpenSaveCloseModalProps.ts';

const GenerateRecommendationsModal: React.FC<GenerateRecommendationsModalProps> = ({ isOpen, onClose, onSave }) => {
    const [selectedItem, setSelectedItem] = useState('');
    const [date, setDate] = useState(new Date());
    const [intensity, setIntensity] = useState('low');

    const handleSave = () => {
        // TODO - call function that gets free time

        // will need to modify this to create the section of times and events once the list is received
        setSelectedItem("")
        const end = new Date(date);
        end.setMinutes(end.getMinutes() + 5);
        const eventData: EventInput = {
            title: selectedItem,
            start: formatDateforDatabase(date),
            end: formatDateforDatabase(end)
        };

        // save to database first
        // const jsonData = JSON.stringify({ event: eventData })
        // apiPost('http://localhost:3001/add_calendar_data', jsonData)
        //     .catch(error => console.log(error));
        // // then save to the users outlook calendar, if not synced nothing will happen
        // apiPost('http://localhost:3001/add_outlook_event', jsonData)
        //     .catch(error => console.log(error));
        onSave(eventData);
        onClose();
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
                </div>
            </div>
        </Modal>
    );
};

export default GenerateRecommendationsModal;