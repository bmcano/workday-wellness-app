import Login from './pages/Login.tsx';
import CreateAccount from './pages/CreateAccount.tsx';
import Home from './pages/Home.tsx';
import Profile from './pages/Profile.tsx';
import Notification from './pages/Notifications.tsx';
import Chat from './pages/Chat.tsx';
import Calendar from './pages/Calendar.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" exact element={<Login />} />
        <Route path="/create_account" exact element={<CreateAccount />} />
        <Route path="/" exact element={<Home />} />
        <Route path="/profile" exact element={<Profile />} />
        <Route path="/notifications" exact element={<Notification />} />
        <Route path="/chat" exact element={<Chat />} />
        <Route path="/calendar" exact element={<Calendar />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;