import Login from './pages/Login.tsx';
import CreateAccount from './pages/CreateAccount.tsx';
import Home from './pages/Home.tsx';
import Profile from './pages/Profile.tsx';
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
      </Routes>
    </BrowserRouter>
  )
}

export default App;
