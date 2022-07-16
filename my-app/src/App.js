import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar/NavBar';
import MainPage from './components/MainPage';
import Explore from './components/Explore';
import LoginCredentials from './components/LoginCredentials';
import CreateAccount from './components/CreateAccount';
import EditAccount from './components/EditAccount';
import SearchUsers from './components/SearchUsers';
import UserProfile from './components/UserProfile'
import Browse from './components/browse'

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' exact element={<LoginCredentials />} />
        <Route path='/main' exact element={<MainPage />} />
        <Route path='/user_profile' exact element={<UserProfile />} />
		<Route path='/explore' exact element={<Explore/>} />
        <Route path='/create_account' exact element={<CreateAccount />} />
        <Route path='/edit_account' exact element={<EditAccount />} />
        <Route path='/search_users' exact element={<SearchUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
