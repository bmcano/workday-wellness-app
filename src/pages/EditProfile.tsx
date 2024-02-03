import "../App.css";
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { useNavigate } from "react-router-dom";
import UploadImage from "../components/UploadImage.tsx";

const EditProfile: React.FC = () => {

    const navigate = useNavigate()
    useEffect(() => {
        AuthorizedUser(navigate)
    }, [navigate])

    const handleImageUpload = async (image: File) => {
        try {
            const base64Image = await toBase64Encoding(image);
            const jsonData = JSON.stringify({ base64Image: base64Image })
            fetch(
                "http://localhost:3001/upload", {
                method: "post",
                credentials: 'include',
                body: jsonData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
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
            <Navbar />
            <h1>Edit Profile</h1>
            <h3>Image Upload</h3>
            <UploadImage handleImageUpload={handleImageUpload} />
        </React.Fragment>
    )
}

export default EditProfile;