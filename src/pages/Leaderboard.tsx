import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import "../App.css";
import { apiGet } from "../api/serverApiCalls.tsx";
import Divider from '../components/card/Divider.tsx';

const TABS = ['Global', 'Friends Only'];

const UserTable = ({ users, title }) => {
  return (
    <div>
      <div className="card-inside-header-text">{title}</div>
      <Divider />
      <table className="table is-fullwidth is-striped is-hoverable is-narrow is-bordered">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody className='card-list'>
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
  const [streakLeaderboardData, setStreakLeaderboardData] = useState([]); // Streak data state
  const [completedLeaderboardData, setCompletedLeaderboardData] = useState([]); // Completed exercises data state
  const [friendsStreakData, setFriendsStreakData] = useState([]); // Friends streak data state
  const [friendsCompletedData, setFriendsCompletedData] = useState([]); // Friends completed data state

  useEffect(() => {
    AuthorizedUser(navigate);

    if (activeTab === 'Global') {
      apiGet("/get_global_leaderboard_streak")
        .then(data => {
          if (data.authorized && data.leaderboard) {
            const formattedLeaderboardData = data.leaderboard.map((user, index) => ({
              rank: index + 1,
              name: user.full_name,
              score: user.streak
            }));
            setStreakLeaderboardData(formattedLeaderboardData);
          }
        })
        .catch(error => {
          console.log(error);
        });

      apiGet("/get_global_leaderboard_completed")
        .then(data => {
          if (data.authorized && data.leaderboard) {
            const formattedLeaderboardData = data.leaderboard.map((user, index) => ({
              rank: index + 1,
              name: user.full_name,
              score: user.completed.amount
            }));
            setCompletedLeaderboardData(formattedLeaderboardData);
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else if (activeTab === 'Friends Only') {
      apiGet("/get_friend_leaderboard_streak")
        .then(data => {
          if (data.authorized && data.leaderboard) {
            const formattedLeaderboardData = data.leaderboard.map((user, index) => ({
              rank: index + 1,
              name: user.full_name,
              score: user.streak
            }));
            setFriendsStreakData(formattedLeaderboardData);
          }
        })
        .catch(error => {
          console.log(error);
        });


      apiGet("/get_friend_leaderboard_completed")
        .then(data => {
          if (data.authorized && data.leaderboard) {
            const formattedLeaderboardData = data.leaderboard.map((user, index) => ({
              rank: index + 1,
              name: user.full_name,
              score: user.completed.amount
            }));
            setFriendsCompletedData(formattedLeaderboardData);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [navigate, activeTab]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    if (activeTab === 'Global') {
      return (
        <div className="card-columns">
          <div className="card-column">
            <UserTable users={streakLeaderboardData} title="Highest Global Streak Leaderboard" />
          </div>
          <div className="card-column">
            <UserTable users={completedLeaderboardData} title="Highest Global Exercise Completion" />
          </div>
        </div>
      );
    } else if (activeTab === 'Friends Only') {
      return (
        <div className="card-columns">
          <div className="card-column">
            <UserTable users={friendsStreakData} title="Highest Friend Streak Leaderboard" />
          </div>
          <div className="card-column">
            <UserTable users={friendsCompletedData} title="Highest Friend Exercise Completion" />
          </div>
        </div>
      );
    } else {
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
        </div>
      </div>
    </React.Fragment>
  );
};

export default Leaderboard;