
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import GenerateRecommendationsModal from './modals/GenerateRecommendationsModal.tsx';
import Card from './card/Card.tsx';
import CardRow from './card/CardRow.tsx';
import CardText from './card/CardText.tsx';

const GenerateRecommendations: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveEvent = (eventData: any) => {
        console.log('Events saved: ', eventData);
        window.location.reload();
        handleCloseModal();
    };

    return (
        <Card isHighlighted={true}>
            <CardRow>
                <CardText type="header" text="Don't have any exercises?" style={{ marginTop: "0px", marginBottom: "0px" }}/>
                <div className="card-button">
                    <Button variant="text" color="primary" onClick={handleOpenModal}>Generate Recommendations</Button>
                    <GenerateRecommendationsModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveEvent} />
                </div>
            </CardRow>
        </Card>
    );
}

export default GenerateRecommendations;