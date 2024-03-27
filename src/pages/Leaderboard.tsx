import "../App.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import { AuthorizedUser } from "../api/AuthorizedUser.tsx";
import { apiGet } from "../api/serverApiCalls.tsx";
import Divider from '../components/card/Divider.tsx';
import CardText from '../components/card/CardText.tsx';
import Column from '../components/card/Column.tsx';
import Card from '../components/card/Card.tsx';
import CardList from '../components/card/CardList.tsx';
import CardRow from '../components/card/CardRow.tsx';

const TABS = ['Global', 'Friends Only'];

const UserTable = ({ users, title, name }) => {
  return (
    <Card>
      <CardText type="header" text={title} style={{ marginTop: "0px", marginBottom: "0px" }} />
      <Divider />
      <CardList>
        <CardRow isTableRow={true}>
          <CardText type="title" text="Placement" />
          <CardText type="title" text="Name" />
          <CardText type="title" text="Score" />
        </CardRow>
        <Divider />
        {users.map((user, index) => (
          <div key={index}>
            <CardRow isTableRow={true} isHighlighted={name === user.name}>
              <CardText type="body" text={user.rank} />
              <CardText type="body" text={user.name} />
              <CardText type="body" text={user.score} />
            </CardRow>
            {index < users.length - 1 && <Divider />}
          </div>
        ))}
      </CardList>
    </Card >
  );
};

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
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
            setUserName(data.user.full_name);
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
        <Column>
          <UserTable users={streakLeaderboardData} title="Longest Current Streak - Global" name={userName} />
          <UserTable users={completedLeaderboardData} title="Most Completed Events - Global" name={userName} />
        </Column>
      );
    } else if (activeTab === 'Friends Only') {
      return (
        <Column>
          <UserTable users={friendsStreakData} title="Longest Current Streak - Friends" name={userName} />
          <UserTable users={friendsCompletedData} title="Most Completed Events - Friends" name={userName} />
        </Column>
      );
    } else {
      return <div>Select a tab.</div>;
    }
  };

  return (
    <React.Fragment>
      <Navbar />
      <Card>
        <CardRow>
          <CardText type="header" text="Leaderboard" style={{ marginTop: "0px", marginBottom: "0px" }} />
          <Divider isVertical={true} />
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </CardRow>
      </Card>
      {renderTabContent()}
    </React.Fragment>
  );
};

export default Leaderboard;