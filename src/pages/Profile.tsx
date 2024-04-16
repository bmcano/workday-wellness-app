import "../App.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { apiGet } from '../api/serverApiCalls.tsx';
import ProfilePicture from "../components/ProfilePicture.tsx";
import Divider from "../components/card/Divider.tsx";
import Badges from "../components/Badges.tsx";

const TABS = ['About', 'Latest Activity', 'Status', 'Friends'];

const Profile: React.FC = () => {

  const [name, setName] = useState("");
  const [joinDate, setJoinDate] = useState<Date>("January 1st, 2024" as unknown as Date);
  const [linkedIn, setLinkedIn] = useState("");
  const [about, setAbout] = useState("User has not set any information.");
  const [friendCount, setFriendCount] = useState(0);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [achievements, setAchievements] = useState({
    MadeFriend: false,
    OneDayStreak: false,
    TenDayStreak: false,
    HundredDayStreak: false,
    OneDayEx: false,
    TenDayEx: false,
    HundredDayEx: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    AuthorizedUser(navigate);
    apiGet("/user")
      .then(data => {
        if (data.authorized) {
          setName(`${data.user.first_name} ${data.user.last_name}`);
          setJoinDate(data.user.join_date);
          setLinkedIn(data.user.linkedIn_link);
          if (data.user.about !== "") {
            setAbout(data.user.about);
          }
          setFriendCount(data.user.friends.length);
        }
      })
      .catch(error => console.log(error))
    apiGet("/get_achievement")
      .then(data => {
        if (data.authorized && data.achievements) {
          setAchievements(data.achievements);
        }
      })
      .catch(error => console.log(error));
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
        return <div>Status content goes here.</div>;
      case 'Friends':
        return <div>Friends list goes header.</div>;
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
          <div className="profile-info-achievements-container">
            <div className="profile-text-container">
              <h1>{name}</h1>
              <p>Joined on {(joinDate as unknown as string).split('T')[0]}</p>
              <p>{friendCount} Friend(s)</p>
              <a href={linkedIn} target="_blank" rel="noopener noreferrer">{linkedIn}</a>
            </div>

          </div>

        </div>
        <Divider style={{ marginTop: "16px" }} />
        <Badges achievements={achievements} />
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
