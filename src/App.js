import './App.css';
import Login from './pages/Login.tsx';
import CreateAccount from './pages/CreateAccount.tsx';
import Home from './pages/Home.tsx';
import Profile from './pages/Profile.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import EditProfile from './pages/EditProfile.tsx';
import Friends from './pages/Friends.tsx';
import UserProfile from './pages/UserProfile.tsx';
import Calendar from './pages/Calendar.tsx';
import Settings from './pages/Settings.tsx';
import Exercises from './pages/Exercises.tsx';
import EditExercises from './pages/EditExercises.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import UserSearch from './pages/UserSearch.tsx';
import AboutPage from './pages/About.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import Leaderboard from './pages/Leaderboard.tsx';
import Privacy from './pages/EditPrivacySettings.tsx';
import LifetimeStats from './pages/LifetimeStats.tsx';

const App = () => {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#fc2929',
      },
    },
    typography: {
      button: {
        textTransform: 'none',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/login" exact element={<Login />} />
          <Route path="/create_account" exact element={<CreateAccount />} />
          <Route path="/forgot_password" exact element={<ForgotPassword />} />
          <Route path="/" exact element={<Home />} />
          <Route path="/profile" exact element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/privacy" exact element={<Privacy />} />
          <Route path="/profile/friends" exact element={<Friends />} />
          <Route path="/user/search/:id" element={<UserProfile />} />
          <Route path="/user/search" element={<UserSearch />} />
          <Route path="/calendar" exact element={<Calendar />} />
          <Route path="/settings" exact element={<Settings />} />
          <Route path="/exercises" exact element={<Exercises />} />
          <Route path="/exercises/edit" exact element={<EditExercises />} />
          <Route path="/about" exact element={<AboutPage />} />
          <Route path="/leaderboard" exact element={<Leaderboard />} />
          <Route path="/reset-password/:id" exact element={<ResetPassword />} />
          <Route path="/profile/lifetime-stats" exact element={<LifetimeStats />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;