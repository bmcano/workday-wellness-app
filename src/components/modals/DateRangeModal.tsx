import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@mui/material';
import { customModalStyle, marginTLR, dividerMargin } from './modalStyles.ts';

Modal.setAppElement('#root');

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (start: Date, end: Date) => void;
}

const DateRangeModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onSave }) => {
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
            <div className='card'>
                <div className='card-list'>
                    <p className="card-header-text">Select Date Range</p>
                    <div className='card-item' style={marginTLR}>
                        <div className='card-title-text' style={{ marginLeft: "16px" }}>Start date:</div>
                    </div>
                    <div className='card-item' style={marginTLR}>
                        <div className='card-text'>
                            <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} dateFormat="P" />
                        </div>
                    </div>
                    <div className='card-item' style={marginTLR}>
                        <div className="card-title-text" style={{ marginLeft: "16px" }}>End date:</div>
                    </div>
                    <div className='card-item' style={marginTLR}>
                        <div className='card-text'>
                            <DatePicker selected={endDate} onChange={(date: Date) => setEndDate(date)} dateFormat="P" />
                        </div>
                    </div>
                    <div className='divider' style={dividerMargin} />
                    <div className='card-item' style={{ marginTop: '16px' }}>
                        <div className='card-button'>
                            <Button variant="text" color="primary" onClick={handleSave}>Sync Calendar</Button>
                            <Button variant="text" onClick={onClose}>Close</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DateRangeModal;