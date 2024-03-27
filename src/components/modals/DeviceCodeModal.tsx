import React from 'react';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@mui/material';
import { customModalStyle, marginTLR } from './modalStyles.ts';
import { DeviceCodeModalProps } from './OpenSaveCloseModalProps.ts';
import Divider from '../card/Divider.tsx';
import Card from '../card/Card.tsx';
import CardText from '../card/CardText.tsx';
import CardList from '../card/CardList.tsx';
import CardRow from '../card/CardRow.tsx';

const DeviceCodeModal: React.FC<DeviceCodeModalProps> = ({ isOpen, onClose, deviceCodeMessage }) => {

    const handleCopy = () => {
        navigator.clipboard.writeText(deviceCodeMessage.userCode);
        window.open(deviceCodeMessage.verificationUri);
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Device Code Modal"
            style={customModalStyle}
        >
            <Card>
                <CardList>
                    <CardText type="header" text="Outlook Login" />
                    <CardRow style={marginTLR}>
                        <div className='card-text'>{deviceCodeMessage.message}</div>
                    </CardRow>
                    <Divider style={marginTLR} />
                    <CardRow style={{ marginTop: '16px' }}>
                        <div className='card-button'>
                            <Button variant="text" color="primary" onClick={handleCopy}>Copy & Open</Button>
                            <Button variant="text" onClick={onClose}>Close</Button>
                        </div>
                    </CardRow>
                </CardList>
            </Card>
        </Modal>
    );
};

export default DeviceCodeModal;