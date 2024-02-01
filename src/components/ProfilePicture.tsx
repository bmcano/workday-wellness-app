import React from "react";

const ProfilePicture = ({ base64Image }) => {
    return (
        <div>
            <h2>Profile Picture</h2>
            {base64Image && <img src={`data:image/png;base64,${base64Image}`} alt="Uploaded" />}
        </div>
    )
}

export default ProfilePicture;