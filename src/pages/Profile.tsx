import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import pfpImage from '../static/images/default_profile_picture.png';
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import "../App.css";

const TABS = ['About', 'Latest Activity', 'Posts', 'Status']; 

const Profile: React.FC = () => {

  const [activeTab, setActiveTab] = useState(TABS[0]); 
  const navigate = useNavigate();

  useEffect(() => {
    AuthorizedUser(navigate);
  }, [navigate]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'About':
        return <div>About content goes here.</div>;
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
                <h1>Ian</h1>
                <p>{'{Insert Role at Company}'}</p>
                <p>Since Jan 1st 1999</p>
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
