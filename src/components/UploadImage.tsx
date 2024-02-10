import Button from '@mui/material/Button';
import React, { ChangeEvent, useState } from 'react';

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
        <form onSubmit={handleSubmit}>
            <input type="file" accept=".png, .jpeg, .jpg" onChange={handleFileChange} />
            <Button variant="contained" color="primary" type="submit">Upload Image</Button>
        </form>
    )
};

export default UploadImage;