import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar/NavBar';
import MainPage from './components/MainPage';
import Explore from './components/Explore';
import LoginCredentials from './components/LoginCredentials';
import CreateAccount from './components/CreateAccount';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" exact element={<LoginCredentials />} />
        <Route path="/main" exact element={<MainPage />} />
        <Route path="/explore" exact element={<Explore />} />
        <Route path="/user_profile" exact element={<UserProfile />} />
        <Route path="/create_account" exact element={<CreateAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
