import Button from '@mui/material/Button';
import React, { ChangeEvent, useState } from 'react';
import CardText from './card/CardText.tsx';
import Card from './card/Card.tsx';
import Divider from './card/Divider.tsx';

const UploadImage = ({ handleImageUpload }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        setSelectedImage(file || null);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedImage) {
            handleImageUpload(selectedImage);
        }
    };

    return (
        <Card>
            <CardText type="header" text="Profile Picture" style={{ marginTop: "0px", marginBottom: "0px" }} />
            <Divider />
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".png, .jpeg, .jpg" onChange={handleFileChange} />
                <div>
                    <Button variant="contained" color="primary" type="submit" style={{ marginTop: '16px' }}>Upload Image</Button>
                </div>
            </form>
        </Card>
    )
};

export default UploadImage;