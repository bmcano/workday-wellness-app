import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@mui/material';
import { customModalStyle, marginTLR, dividerMargin } from './modalStyles.ts';
import { DateRangeModalProps } from './OpenSaveCloseModalProps.ts';
import Divider from '../card/Divider.tsx';
import Card from '../card/Card.tsx';
import CardText from '../card/CardText.tsx';
import CardList from '../card/CardList.tsx';
import CardRow from '../card/CardRow.tsx';

const DateRangeModal: React.FC<DateRangeModalProps> = ({ isOpen, onClose, onSave }) => {
    const [startDate, setStartDate] = useState(() => {
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        return firstDayOfMonth;
    });

    const [endDate, setEndDate] = useState(() => {
        const lastDayOfMonth = new Date();
        lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
        lastDayOfMonth.setDate(0);
        return lastDayOfMonth;
    });

    const handleSave = () => {
        onSave(startDate, endDate);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Date Range Modal"
            style={customModalStyle}
        >
            <Card>
                <CardList>
                    <CardText type="header" text="Select Date Range" style={{ marginLeft: "32px" }} />
                    <CardRow style={marginTLR}>
                        <CardText type="title" text="Start date:" style={{ marginLeft: "16px", marginTop: "0px", marginBottom: "0px" }} />
                    </CardRow>
                    <CardRow style={marginTLR}>
                        <div className='first-item-row'>
                            <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} dateFormat="P" />
                        </div>
                    </CardRow>
                    <CardRow style={marginTLR}>
                        <CardText type="title" text="End date:" style={{ marginLeft: "16px", marginTop: "0px", marginBottom: "0px" }} />
                    </CardRow>
                    <CardRow style={marginTLR}>
                        <div className='first-item-row'>
                            <DatePicker selected={endDate} onChange={(date: Date) => setEndDate(date)} dateFormat="P" />
                        </div>
                    </CardRow>
                    <Divider style={dividerMargin} />
                    <CardRow>
                        <div className='card-button'>
                            <Button variant="text" color="primary" onClick={handleSave}>Sync Calendar</Button>
                            <Button variant="text" onClick={onClose}>Close</Button>
                        </div>
                    </CardRow>
                </CardList>
            </Card>
        </Modal>
    );
};

export default DateRangeModal;