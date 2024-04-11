import "../App.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { apiGet } from '../api/serverApiCalls.tsx';
import ProfilePicture from "../components/ProfilePicture.tsx";
import Divider from "../components/card/Divider.tsx";

const TABS = ['About', 'Latest Activity', 'Status', 'Friends'];

const Profile: React.FC = () => {

  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState<Date>("January 1st, 2024" as unknown as Date);
  const [linkedIn, setLinkedIn] = useState("");
  const [about, setAbout] = useState("User has not set any information.");
  const [friendCount, setFriendCount] = useState(0);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [status, setStatus] = useState("User has not set a status.");
  const [friends, setFriends] = useState([]);  const navigate = useNavigate();

  useEffect(() => {
    AuthorizedUser(navigate);
    apiGet("/user")
      .then(data => {
        if (data.authorized) {
          setName(`${data.user.first_name} ${data.user.last_name}`);
          setBirthday(data.user.birthday);
          setLinkedIn(data.user.linkedIn_link);
          if (data.user.about !== "") {
            setAbout(data.user.about);
          }
          setFriendCount(data.user.friends.length);
          setFriends(data.user.friends);
        }
      })
      .catch(error => console.log(error))
      apiGet('/status')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setStatus(data.status);
        }
      })
      .catch((error) => {
        console.error('Error retrieving status:', error);
      });

      
  }, [navigate]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'About':
        return <div>{about}</div>;
      case 'Latest Activity':
        return <div>Latest Activity content goes here.</div>;
      case 'Status':
        return <div>{status}</div>;
      case 'Friends':
        return (
          <div>
            {friends.map((friend, index) => (
              <div key={index}>
                <p>{friend}</p>
              </div>
            ))}
          </div>
        );
      default:
        return <div>Select a tab.</div>;
    }
  };

  return (
    <React.Fragment>
      <Navbar />
      <div className="card card-span-4">
        <div className="profile-content-container">
          <div className="profile-picture-page" onClick={() => navigate("/profile/edit")}>
            <ProfilePicture isUserProfile={true} base64Img={""} isSmallScreen={false} />
            <div className="edit-overlay">Edit</div>
          </div>
          <div className="profile-text-container">
            <h1>{name}</h1>
            <p>Birthday: {(birthday as unknown as string).split('T')[0]}</p>
            <p>{friendCount} Friend(s)</p>
            <a href={linkedIn} target="_blank" rel="noopener noreferrer">{linkedIn}</a>
          </div>
        </div>
        <div className="card-header">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <Divider />
        <div className="card-content">
          {renderTabContent()}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Profile;
