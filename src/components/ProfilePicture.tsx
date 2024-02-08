import React, { useEffect, useState } from "react";
import { apiGet } from "../api/serverApiCalls.tsx";
import DefaultProfile from "./DefaultProfile.tsx";

interface ImageStyle {
    width: string;
    height: string;
    borderRadius: string;
    objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    margin: string;
    display: string;
}

const ProfilePicture = ({ isUserProfile, base64Img, isSmallScreen }) => {

    const [base64Image, setBase64Image] = useState("");

    const smallImageStyle: ImageStyle = {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        objectFit: "cover",
        margin: "0 0",
        display: "block",
    };

    const largeImageStyle: ImageStyle = {
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        objectFit: "cover",
        margin: "0 auto",
        display: "block",
    };

    useEffect(() => {
        if (isUserProfile) {
            apiGet('http://localhost:3001/get_user')
                .then(res => res.json())
                .then(data => {
                    if (data.authorized) {
                        setBase64Image(data.user.profile_picture === "" ? DefaultProfile : data.user.profile_picture);
                    }
                })
                .catch(err => console.log(err));
        } else {
            setBase64Image(base64Img)
        }
    }, [isUserProfile, base64Img]);

    return (
        <div>
            {base64Image && <img src={`data:image/png;base64,${base64Image}`} alt="Uploaded" style={isSmallScreen ? smallImageStyle : largeImageStyle} />}
        </div>
    )
}

export default ProfilePicture;