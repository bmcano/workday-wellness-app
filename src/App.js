import Login from './pages/Login.tsx';
import CreateAccount from './pages/CreateAccount.tsx';
import Home from './pages/Home.tsx';
import Profile from './pages/Profile.tsx';
import Friends from './pages/Friends.tsx';
import FriendsProfile from './pages/FriendsProfile.tsx';
import Notification from './pages/Notifications.tsx';
import Chat from './pages/Chat.tsx';
import Calendar from './pages/Calendar.tsx';
import Settings from './pages/Settings.tsx';
import Exercises from './pages/Exercises.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import UserSearch from './pages/UserSearch.tsx';

const App = () => {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#fc2929',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" exact element={<Login />} />
          <Route path="/create_account" exact element={<CreateAccount />} />
          <Route path="/" exact element={<Home />} />
          <Route path="/profile" exact element={<Profile />} />
          <Route path="/profile/friends" exact element={<Friends />} />
          <Route path="/profile/friends/:id" element={<FriendsProfile />} />
          <Route path="/user/search" element={<UserSearch />} />
          <Route path="/notifications" exact element={<Notification />} />
          <Route path="/chat" exact element={<Chat />} />
          <Route path="/calendar" exact element={<Calendar />} />
          <Route path="/settings" exact element={<Settings />} />
          <Route path="/exercises" exact element={<Exercises />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;