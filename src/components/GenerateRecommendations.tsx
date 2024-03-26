
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import GenerateRecommendationsModal from './modals/GenerateRecommendationsModal.tsx';
import Card from './card/Card.tsx';
import CardRow from './card/CardRow.tsx';

const GenerateRecommendations: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveEvent = (eventData: any) => {
        // window.location.reload();
        console.log('Events saved: ', eventData);
        handleCloseModal();
    };

    return (
        <Card isHighlighted={true}>
            <CardRow>
                <div className="card-inside-header-text">Don't have any exercises?</div>
                <div className="card-button">
                    <Button variant="text" color="primary" onClick={handleOpenModal}>Generate Recommendations</Button>
                    <GenerateRecommendationsModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveEvent} />
                </div>
            </CardRow>
        </Card>
    );
}

export default GenerateRecommendations;