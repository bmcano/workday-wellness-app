import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Friend } from '../types/Friend';
import ProfilePicture from './ProfilePicture.tsx';
import DefaultProfile from './DefaultProfile.tsx';
import Divider from './card/Divider.tsx';
import Card from './card/Card.tsx';
import CardList from './card/CardList.tsx';
import CardRow from './card/CardRow.tsx';

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
            <Card>
                <CardList>
                    {filteredFriendsList.map((friend, index) => (
                        <div key={index}>
                            <CardRow>
                                <ProfilePicture isUserProfile={false} base64Img={friend.profile_picture === "" ? DefaultProfile : friend.profile_picture} isSmallScreen={true} />
                                <div className="card-text">{`${friend.first_name} ${friend.last_name}`}</div>
                                <div className='card-button'>
                                    <Button variant="text" color="primary" onClick={() => navigate(`/user/search/${friend.id}`)}>View Profile</Button>
                                </div>
                            </CardRow>
                            {index < filteredFriendsList.length - 1 && <Divider />}
                        </div>
                    ))}
                </CardList>
            </Card>
        </div>
    )
}

export default UserSearchList;