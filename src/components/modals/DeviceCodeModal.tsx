import React from 'react';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@mui/material';
import { customModalStyle, marginTLR } from './modalStyles.ts';

Modal.setAppElement('#root');

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    deviceCodeMessage: any;
}

const DeviceCodeModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, deviceCodeMessage }) => {

    const handleCopy = () => {
        console.log(deviceCodeMessage.userCode);
        navigator.clipboard.writeText(deviceCodeMessage.userCode);
        window.open(deviceCodeMessage.verificationUri);
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Add Event Modal"
            style={customModalStyle}
        >
            <div className='card'>
                <div className='card-list'>
                    <p className="card-header-text">Outlook Login</p>
                    <div className='card-item' style={marginTLR}>
                        <div className='card-text'>{deviceCodeMessage.message}</div>
                    </div>
                    <div className='divider' style={marginTLR} />
                    <div className='card-item' style={{ marginTop: '16px' }}>
                        <div className='card-button'>
                            <Button variant="text" color="primary" onClick={handleCopy}>Copy & Open</Button>
                            <Button variant="text" onClick={onClose}>Cancel</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DeviceCodeModal;