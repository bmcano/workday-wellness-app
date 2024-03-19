import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import "../App.css";
import { getFullAppLink } from '../util/getFullAppLink.ts';

const TABS = ['Global', 'Friends Only'];

const UserTable = ({ users, title }) => {
  return (
    <div>
      <h3 className="title is-3">{title}</h3>
      <table className="table is-fullwidth is-striped is-hoverable is-narrow is-bordered">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.rank}</td>
              <td>{user.name}</td>
              <td>{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]); 
  const navigate = useNavigate();

  useEffect(() => {
    AuthorizedUser(navigate);
  }, [navigate]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    let streakUsers, exerciseUsers;

    const uniqueUsers = [
     { name: 'Alice', rank: 1, score: 90 },
      { name: 'Bob', rank: 2, score: 80 },
      { name: 'Charlie', rank: 3, score: 70 },
      { name: 'David', rank: 4, score: 60 },
      { name: 'Eve', rank: 5, score: 50 },
      { name: 'Frank', rank: 6, score: 40 },
      { name: 'Grace', rank: 7, score: 30 },
      { name: 'Heidi', rank: 8, score: 20 },
      { name: 'Ivan', rank: 9, score: 10 },
      { name: 'Judy', rank: 10, score: 5 },
    ];

    switch (activeTab) {
      case 'Global':
        streakUsers = uniqueUsers.map((user) => ({
          ...user,
          score: Math.floor(Math.random() * 50) + 1,
        }));

        exerciseUsers = uniqueUsers.map((user) => ({
          ...user,
          score: Math.floor(Math.random() * 100) + 1,
        }));
        break;
      case 'Friends Only':
        streakUsers = uniqueUsers.slice(0, 5).map((user) => ({
          ...user,
          score: Math.floor(Math.random() * 50) + 1,
        }));

        exerciseUsers = uniqueUsers.slice(0, 5).map((user) => ({
          ...user,
          score: Math.floor(Math.random() * 100) + 1,
        }));
        break;
      default:
        return <div>Select a tab.</div>;
    }

    return (
      <div className="columns">
        <div className="column">
          <UserTable users={streakUsers} title="Highest Streak Leaderboard" />
        </div>
        <div className="column">
          <UserTable users={exerciseUsers} title="Exercise Completed Leaderboard" />
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <Navbar />
      <div className="card-columns">
        <div className="card-column">
          <div className="card card-span-4">
            <div className="profile-content-container">
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

export default Leaderboard;