import "../App.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { apiGet } from '../api/serverApiCalls.tsx';
import ProfilePicture from "../components/ProfilePicture.tsx";
import Divider from "../components/card/Divider.tsx";
import Badges from "../components/Badges.tsx";
import Card from "../components/card/Card.tsx";
import { Button } from "@mui/material";
import CardText from "../components/card/CardText.tsx";

const TABS = ['About', 'Latest Activity', 'Status'];

type Status = {
  _id: string;
  email: string;
  status: string;
  timestamp: Date;
};

type Activity = {
  exercise: string;
  timestamp: string;
}

const Profile: React.FC = () => {

  const [name, setName] = useState("");
  const [joinDate, setJoinDate] = useState<Date>("January 1st, 2024" as unknown as Date);
  const [birthday, setBirthday] = useState<string | null>(null);
  const [linkedIn, setLinkedIn] = useState("");
  const [about, setAbout] = useState("User has not set any information.");
  const [friendCount, setFriendCount] = useState(0);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [activity, setLatestActivity] = useState<Activity[]>([]);
  const [status, setStatus] = useState<Status[]>([]);
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
          if (data.user.birthday) {
            setBirthday(`Birthday: ${data.user.birthday}`);
          }

          setLinkedIn(data.user.linkedIn_link);
          if (data.user.about !== "") {
            setAbout(data.user.about);
          }
          setFriendCount(data.user.friends.length);
        }
      })
      .catch(error => console.log(error))
    apiGet("/user_status")
      .then(data => {
        if (data.success) {
          const currentDate = new Date();
          const fortyEightHoursAgo = new Date(currentDate);
          fortyEightHoursAgo.setHours(currentDate.getHours() - 48);
          const filteredItems = data.statuses.filter(item => {
            const itemDate = new Date(item.timestamp);
            return itemDate >= fortyEightHoursAgo && itemDate <= currentDate;
          });
          setStatus(filteredItems);
        }
      })
      .catch((error) => console.log(error));
    apiGet("/get_user_activity")
      .then(data => {
        if (data.authorized) {
          const currentDate = new Date();
          const fortyEightHoursAgo = new Date(currentDate);
          fortyEightHoursAgo.setHours(currentDate.getHours() - 48);
          const filteredItems = data.completedExercises.exercises.filter(item => {
            const itemDate = new Date(item.timestamp);
            return itemDate >= fortyEightHoursAgo && itemDate <= currentDate;
          });
          setLatestActivity(filteredItems);
        }
      })
      .catch((error) => console.log(error));
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
        return <CardText type="title" text={about}  />
      case 'Latest Activity':
        return (
          <div className="card-info">
            {activity.length > 0 && (
                <CardText type="title" text="Your recent activity from the last 48 hours." style={{ marginTop: "-8px" }} />
            )}
            {activity.length > 0 && activity.map((s, index) => (
              <div key={index} className="user-status-card">
                <div className="friend-status-message">{s.exercise}</div>
                <div className="friend-status-timestamp">Completed at: {new Date(s.timestamp).toLocaleString()}</div>
              </div>
            ))}
            {activity.length === 0 && (
               <CardText type="title" text="You have no recent activity." />
            )}
          </div>
        )
      case 'Status':
        return (
          <div className="card-info">
            {status.length > 0 && (
                <CardText type="title" text="Your statuses from the last 48 hours." style={{ marginTop: "-8px" }} />
            )}
            {status.length > 0 && status.map((s, index) => (
              <div key={index} className="user-status-card">
                <div className="friend-status-name">You</div>
                <div className="friend-status-message">{s.status}</div>
                <div className="friend-status-timestamp">{new Date(s.timestamp).toLocaleString()}</div>
              </div>
            ))}
            {status.length === 0 && (
               <CardText type="title" text="You've posted no statuses in the last 48 hours." />
            )}
          </div>
        )
      default:
        return <div>Select a tab.</div>;
    }
  };

  return (
    <React.Fragment>
      <Navbar />
      <Card>
        <div className="profile-content-container">
          <div className="profile-picture-page" onClick={() => navigate("/profile/edit")}>
            <ProfilePicture isUserProfile={true} base64Img={""} isSmallScreen={false} />
            <div className="edit-overlay">Edit</div>
          </div>
          <div className="profile-text-container">
            <h1>{name}</h1>
            <p>Joined on {(joinDate as unknown as string).split('T')[0]}</p>
            {birthday && <p>{birthday.split('T')[0]}</p>}
            <a href={linkedIn} target="_blank" rel="noopener noreferrer">{linkedIn}</a>
            <div className="card-button-left">
              <Button variant="text" color="primary" onClick={() => navigate("/profile/friends")}>View all {friendCount} Friend(s)</Button>
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

      </Card>
    </React.Fragment>
  );
};

export default Profile;
