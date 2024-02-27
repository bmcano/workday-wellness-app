import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
// @ts-ignore
import pfpImage from '../static/images/default_profile_picture.png';
// @ts-ignore
import alexpfp from '../static/images/alexpfp.jpeg';
// @ts-ignore
import rogpfp from '../static/images/rogeliopfp.jpeg';
// @ts-ignore
import brandonpfp from '../static/images/brandonpfp.jpeg';
// @ts-ignore
import ianpfp from '../static/images/ianpfp.jpeg';
// @ts-ignore
import linkedinicon from '../static/images/linkedin image.png';
// @ts-ignore
import githubicon from '../static/images/github image.png';
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import "../App.css";

const TABS = ['Alex', 'Brandon', 'Ian', 'Rogelio'];

const About: React.FC = () => {

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const navigate = useNavigate();

  useEffect(() => {
    AuthorizedUser(navigate);
  }, [navigate]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const renderProfilePic = () => {
    switch (activeTab) {
      case 'Alex':
        return <img src={alexpfp} alt="Profile" />;
      case 'Brandon':
        return <img src={brandonpfp} alt="Profile" />;
      case 'Ian':
        return <img src={ianpfp} alt="Profile" />;
      case 'Rogelio':
        return <img src={rogpfp} alt="Profile" />;
      default:
        <img src={pfpImage} alt="Profile" />;
    }
  };

  const linkContainer = (github: string, linkedIn: string) => {
    return (
      <div className="social-links-container">
        <a href={github} target="_blank" rel="noopener noreferrer">
          <img src={githubicon} alt="GitHub Profile" className="social-icon" />
        </a>
        <a href={linkedIn} target="_blank" rel="noopener noreferrer">
          <img src={linkedinicon} alt="LinkedIn Profile" className="social-icon" />
        </a>
      </div>
    );
  }

  const renderSocials = () => {
    switch (activeTab) {
      case 'Alex':
        return linkContainer("https://github.com/AlexErrand", "https://www.linkedin.com/in/michael-arand/");
      case 'Brandon':
        return linkContainer("https://github.com/bmcano", "https://www.linkedin.com/in/brandon-cano/");
      case 'Ian':
        return linkContainer("https://github.com/IanKuk", "");
      case 'Rogelio':
        return linkContainer("https://github.com/RedJelloooo", "https://www.linkedin.com/in/rvalleia/");
      default:
        <img src={pfpImage} alt="Profile" />;
    }
  };

  const renderBasicInfo = () => {
    switch (activeTab) {
      case 'Alex':
        return (
          <>
            <h1>Alex</h1>
            <p>{'Front End'}</p>
            <p>Since January 2024</p>
          </>
        );
      case 'Brandon':
        return (
          <>
            <h1>Brandon</h1>
            <p>{'{Insert Role at Company}'}</p>
            <p>Since Jan 1st 1999</p>
          </>
        );
      case 'Ian':
        return (
          <>
            <h1>Ian</h1>
            <p>{'{Insert Role at Company}'}</p>
            <p>Since Jan 1st 1999</p>
          </>
        );
      case 'Rogelio':
        return (
          <>
            <h1>Rogelio</h1>
            <p>{'{Insert Role at Company}'}</p>
            <p>Since Jan 1st 1999</p>
          </>
        );
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
            <h1>Meet the developers!</h1>
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
            <div className="profile-content-container">
              <div className="profile-picture-page" onClick={() => navigate("/profile/edit")}>
                {renderProfilePic()}
              </div>
              <div className="profile-info-container"> {/* Adjusted the class name */}
                {renderBasicInfo()}
                <div className="social-links-container"> {/* This should be the class you've provided for social links */}
                  {renderSocials()}
                </div>
                
              </div>
              
            </div>
            <div className="divider" />  
            <div className="card-content">
              <h2>About the Project</h2>
              <p>
                <strong>University of Iowa Senior Design Project</strong><br />
                This project was created for our senior design project at the University of Iowa. Sponsored by State Farm, it represents a collaborative effort between students and industry professionals.
              </p>

              <h3>Application Overview</h3>
              <p>

              </p>

              <h3>Frequently Asked Questions (FAQs)</h3>
              <p>

              </p>

              <h3>Medical Disclaimer</h3>
              <p>
                Please note that we are not medical professionals. The recommendations provided by this application are based on our best guesses and should not be taken as professional medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>

    </React.Fragment>
  );
};

export default About;
