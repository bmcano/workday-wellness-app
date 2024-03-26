import React from 'react';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@mui/material';
import { customModalStyle, marginTLR } from './modalStyles.ts';
import { RedirectLinkModalProps } from './OpenSaveCloseModalProps.ts';
import Divider from '../card/Divider.tsx';
import Card from '../card/Card.tsx';
import CardText from '../card/CardText.tsx';
import CardList from '../card/CardList.tsx';
import CardRow from '../card/CardRow.tsx';

const RedirectLinkModal: React.FC<RedirectLinkModalProps> = ({ isOpen, onClose, link }) => {

    const handleOpenLink = () => {
        window.open(link);
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Redirect Link Modal"
            style={customModalStyle}
        >
            <Card>
                <CardList>
                    <CardText type="header" text="External Link Redirect" style={{marginLeft: "-16px"}}/>
                    <CardText type="body" text={`You are about to be redirected to ${link}. Please note that we are not responsible for the content or privacy practices of the site you are about to visit.`} />
                    <CardText type="body" text="Would you like to continue?" />
                    <Divider style={marginTLR} />
                    <CardRow>
                        <div className='card-button'>
                            <Button variant="text" color="primary" onClick={handleOpenLink}>Continue</Button>
                            <Button variant="text" onClick={onClose}>Cancel</Button>
                        </div>
                    </CardRow>
                </CardList>
            </Card>
        </Modal>
    );
};

export default RedirectLinkModal;