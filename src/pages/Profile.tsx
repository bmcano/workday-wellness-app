import "../App.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
// @ts-ignore
import pfpImage from '../static/images/default_profile_picture.png';
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { apiGet } from '../api/serverApiCalls.tsx';

const TABS = ['About', 'Latest Activity', 'Posts', 'Status'];

const Profile: React.FC = () => {

  const [name, setName] = useState("");
  const [joinDate, setJoinDate] = useState<Date>("January 1st, 2024" as unknown as Date);
  const [linkedIn, setLinkedIn] = useState("");
  const [about, setAbout] = useState("User has not set any information.");
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const navigate = useNavigate();

  useEffect(() => {
    AuthorizedUser(navigate);
    apiGet("/user")
      .then(data => {
        if (data.authorized) {
          setName(`${data.user.first_name} ${data.user.last_name}`);
          // TODO - add DB items
          setJoinDate("January 1st, 2024" as unknown as Date);
          setLinkedIn("https://www.linkedin.com/in/brandon-cano/");
          setAbout("I am a software engineer");
        }
      })
      .catch(error => console.log(error))
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
      case 'Posts':
        return <div>Posts content goes here.</div>;
      case 'Status':
        return <div>Status content goes here.</div>;
      default:
        return <div>Select a tab.</div>;
    }
  };

  return (
    <React.Fragment>
      <Navbar />
      <div className="card-columns">
        <div className="card-column">
          <div className="card card-span-4">
            <div className="profile-content-container">
              <div className="profile-picture-page" onClick={() => navigate("/profile/edit")}>
                <img src={pfpImage} alt="Profile" />
                <div className="edit-overlay">Edit</div>
              </div>
              <div className="profile-text-container">
                <h1>{name}</h1>
                <p>Joined on {joinDate.toString()}</p>
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
            <div className="divider" />
            <div className="card-content">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Profile;
