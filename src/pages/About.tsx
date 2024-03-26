import "../App.css";
import React, { useState } from 'react';
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
import Divider from '../components/card/Divider.tsx';
import CardText from "../components/card/CardText.tsx";
import { marginTLR } from "../components/modals/modalStyles.ts";
import CardList from "../components/card/CardList.tsx";
import CardRow from "../components/card/CardRow.tsx";

const TABS = ['Alex', 'Brandon', 'Ian', 'Rogelio'];

const About: React.FC = () => {

  const [activeTab, setActiveTab] = useState(TABS[0]);
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
        return <img src={pfpImage} alt="Profile" />;
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

  const basicInfo = (name: string, degree: string, graduation: string) => {
    return (
      <div>
        <CardText type="header" text={name} style={{ marginLeft: "-16px" }} />
        <CardText type="body" text={degree} />
        <CardText type="body" text={"Graduating: " + graduation} />
      </div>
    );
  }

  const renderBasicInfo = () => {
    switch (activeTab) {
      case 'Alex':
        return (basicInfo("Alex Arand", "B.S.E Computer Science and Engineering", "May, 2024"));
      case 'Brandon':
        return (basicInfo("Brandon Cano", "B.S.E Computer Science and Engineering; M.S. Electrical and Computer Engineering", "May, 2024; May 2025"));
      case 'Ian':
        return (basicInfo("Ian Kuk", "B.S.E Computer Science and Engineering", "December, 2024"));
      case 'Rogelio':
        return (basicInfo("Rogelio Valle", "B.S.E Computer Science and Engineering", "May, 2024"));
      default:
        return <div>Select a tab.</div>;
    }
  };

  return (
    <React.Fragment>
      <Navbar />
      <CardText type="header" text="About This Project" style={marginTLR} />
      <div className="card card-span-4">
        <CardRow>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >{tab}
            </button>
          ))}
        </CardRow>
        <Divider />
        <CardRow>
          <div className="profile-picture-page">
            {renderProfilePic()}
          </div>
          <CardList>
            <div className="profile-info-container">
              {renderBasicInfo()}
            </div>
            <div className="social-links-container" style={{ marginLeft: "16px" }}>
              {renderSocials()}
            </div>
          </CardList>
        </CardRow>
        <Divider />
        <div className="card-content">
          <CardText type="title" text="University of Iowa Senior Design Project" />
          <CardText type="body" text="This project was created as our Senior Design project at the University of Iowa. The original objective, background, and rationale was created by our sponsored, State Farm. It embodies a collaboration between university students and seasoned industry experts." />
          <Divider />
          <CardText type="title" text="Application Background and Objective" />
          <CardText type="body" text="The shift to remote work offers employees flexibility but poses challenges to physical and mental wellness due to reduced movement and interpersonal connections." />
          <CardText type="body" text="Our goal is to develop an application that promotes workday wellness by offering tailored recommendations, reminders for healthy habits, and fostering a supportive user community." />
          <Divider />
          <CardText type="title" text="Frequently Asked Questions (FAQs)" />
          <CardText type="body" text="(TODO) - only keep this if any ideas appear." />
          <Divider />
          <CardText type="title" text="Contact" />
          <CardText type="body" text="For any questions feel free to contact us at: workdaywellnes@outlook.com" />
          <Divider />
          <CardText type="title" text="Medical Disclaimer" />
          <CardText type="body" text="Please be advised that we are not licensed medical practitioners. This application serves solely as a prototype. The suggestions offered by this platform are formulated based on our informed estimations and should not be taken as proper medical advice." />
        </div>
      </div>
    </React.Fragment>
  );
};

export default About;
