import "../App.css";
import React, { useEffect } from 'react';
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import UploadImage from "../components/UploadImage.tsx";
import imageCompression from "browser-image-compression";
import { apiPost } from "../api/serverApiCalls.tsx";

const EditProfile: React.FC = () => {

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate)
    }, [navigate])

    const handleImageUpload = async (image: File) => {
        try {
            console.log(`File size: ${image.size / 1024} KB`);
            var base64Image = ""
            if (image.size > (100 * 1024)) {
                console.log("Compressing Image.");
                const options = {
                    maxSizeMB: 0.1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                }

                const compressedFile = await imageCompression(image, options);
                base64Image = await toBase64Encoding(compressedFile);
                console.log(`compressedFile size ${compressedFile.size / 1024} KB`);
            } else {
                base64Image = await toBase64Encoding(image);
            }

            const jsonData = JSON.stringify({ base64Image: base64Image });
            apiPost('http://localhost:3001/upload', jsonData);
            console.log("Photo saved successfully.");
        } catch (error) {
            console.error('Error saving image to database:', error);
        }
    };

    const toBase64Encoding = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result?.toString().split(",")[1] || "");
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    return (
        <React.Fragment>
            {/* <Navbar /> Probably wont have navbar for edit pages */}
            <h1>Edit Profile</h1>
            <h3>Image Upload</h3>
            <UploadImage handleImageUpload={handleImageUpload} />
        </React.Fragment>
    )
}

export default EditProfile;