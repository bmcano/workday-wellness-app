import "../App.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { apiGet } from '../api/serverApiCalls.tsx';
import ProfilePicture from "../components/ProfilePicture.tsx";
import Divider from "../components/card/Divider.tsx";

const TABS = ['About', 'Latest Activity', 'Status', 'Friends'];

type Status = {
  _id: string;
  email: string;
  status: string;
  timestamp: Date;
};

const Profile: React.FC = () => {

  const [name, setName] = useState("");
  const [joinDate, setJoinDate] = useState<Date>("January 1st, 2024" as unknown as Date);
  const [birthday, setBirthday] = useState<Date>("January 1st, 2024" as unknown as Date);
  const [linkedIn, setLinkedIn] = useState("");
  const [about, setAbout] = useState("User has not set any information.");
  const [friendCount, setFriendCount] = useState(0);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [activity, setLasestAvctivity] = useState("Latest activity has not been set.");
  const [status, setStatus] = useState<Status[]>([]);
  const [friends, setFriends] = useState([]);  const navigate = useNavigate();

  useEffect(() => {
    AuthorizedUser(navigate);
    apiGet("/user")
      .then(data => {
        if (data.authorized) {
          setName(`${data.user.first_name} ${data.user.last_name}`);
          setJoinDate(data.user.join_date);
          setBirthday(data.user.birthday);
          setLinkedIn(data.user.linkedIn_link);
          if (data.user.about !== "") {
            setAbout(data.user.about);
          }
          setFriendCount(data.user.friends.length);
          //setFriends(data.user.friends);
        }
      })
      .catch(error => console.log(error))
      apiGet("/user_status")
      .then(data => {
        if (data.success) {
          setStatus(data.statuses);
        }
      })
      .catch((error) => console.log(error));  
      apiGet("/friends_list")
        .then(data => {
          setFriends(data);
        })
        .catch((error) => console.log(error));
      apiGet("/get_user_records")
      .then(data => {
        if (data.success) {
          setLasestAvctivity(data.records);
        }
      })
      .catch((error) => console.log(error));
  }, [navigate]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'About':
        return <div>{about}</div>;
      case 'Latest Activity':
        return <div>{activity}</div>;
      case 'Status':
        return <div>{status.map((status, index) => (
          <p key={index}>{status.status}</p>
          ))}</div>;
      case 'Friends':
        return (
          <div>
            {friends.map((friend: { first_name: string, last_name: string }, index: number) => (
              <p key={index}>{`${friend.first_name} ${friend.last_name}`}</p>
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
            <p>Joined on {(joinDate as unknown as string).split('T')[0]}</p>
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
