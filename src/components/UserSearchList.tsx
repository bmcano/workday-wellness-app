import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Friend } from '../types/Friend';
import ProfilePicture from './ProfilePicture.tsx';
import DefaultProfile from './DefaultProfile.tsx';

const UserSearchList = ({ userList }) => {

    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate()
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredFriendsList = userList.filter((friend: Friend) =>
        `${friend.first_name} ${friend.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    ) as Friend[];

    return (
        <div>
            <div className="box-card">
                <TextField label="Search" variant="outlined" value={searchTerm} onChange={handleSearch} fullWidth />
            </div>
            <div className="card">
                <ul className="card-list">
                    {filteredFriendsList.map((friend, index) => (
                        <><li key={index} className="card-item">
                            <ProfilePicture isUserProfile={false} base64Img={friend.profile_picture === "" ? DefaultProfile : friend.profile_picture} isSmallScreen={true} />
                            <div className="card-text">{`${friend.first_name} ${friend.last_name}`}</div>
                            <div className='card-button'>
                                <Button variant="contained" color="primary" onClick={() => navigate(`/profile/friends/${friend.id}`)}>View Profile</Button>
                            </div>
                        </li>{index < filteredFriendsList.length - 1 && <div className="divider"></div>}</>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default UserSearchList;