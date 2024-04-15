import "../App.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { apiGet } from '../api/serverApiCalls.tsx';
import ProfilePicture from "../components/ProfilePicture.tsx";
import Divider from "../components/card/Divider.tsx";

// @ts-ignore
import bronzeFlameImage from "../static/assets/bronzeflame.png";
// @ts-ignore
import silverFlameImage from "../static/assets/silverflame.png";
// @ts-ignore
import goldFlameImage from "../static/assets/goldflame.png";
// @ts-ignore
import bronzeBell from "../static/assets/bronzebell.png";
// @ts-ignore
import silverBell from "../static/assets/silverbell.png";
// @ts-ignore
import goldBell from "../static/assets/goldbell.png";
// @ts-ignore
import friendbadge from "../static/assets/friendbadge.png";

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

  const badgesInfo = [
    { image: friendbadge, text: "Made a Friend!", achieved: achievements?.MadeFriend },
    { image: bronzeFlameImage, text: "Streak of One day", achieved: achievements?.OneDayStreak },
    { image: silverFlameImage, text: "Streak of Ten days", achieved: achievements?.TenDayStreak },
    { image: goldFlameImage, text: "Streak of One Hundred days", achieved: achievements?.HundredDayStreak },
    { image: bronzeBell, text: "Completed One Exercise", achieved: achievements?.OneDayEx },
    { image: silverBell, text: "Completed Ten Exercises", achieved: achievements?.TenDayEx },
    { image: goldBell, text: "Completed One Hundred Exercises", achieved: achievements?.HundredDayEx }
  ];


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
          console.log(data.achievements); 
        } else {
          console.log('Not authorized to fetch achievements or no achievements available.');
        }
      })
      .catch(error => {
        console.log("ERROR FETCHING ACHIEVEMENTS:", error);
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

            <div className="achievements-container">
              {badgesInfo.map((badge, index) => badge.achieved && (
                <div key={index} className="image-container">
                  <img src={badge.image} alt={badge.text} />
                  <span className="image-tooltip">{badge.text}</span>
                </div>
              ))}
            </div>
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
