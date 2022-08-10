import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar/NavBar';
import MainPage from './components/MainPage';
import Explore from './components/Explore';
import LoginCredentials from './components/LoginCredentials';
import CreateAccount from './components/CreateAccount';
import UserProfile from './components/UserProfile';
import EditAccount from './components/EditAccount';
import SearchUsers from './components/SearchUsers';
import { useDispatch, useSelector } from 'react-redux';
import { bottomOfPage } from './actions/index';

function App() {
  const dispatch = useDispatch();
  let atBottomOfPage = useSelector(function (state) {
    return state.searchpageReducer.atBottomOfPage;
  });

  document.body.onscroll = function(e) {
    if (atBottomOfPage !== null) {
      const c = window.scrollY + window.innerHeight;
      if (Math.abs(c - document.body.offsetHeight) < 1) {
        dispatch(bottomOfPage(true));
      }
    }
  };
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" exact element={<LoginCredentials />} />
        <Route path="/main" exact element={<MainPage />} />
        <Route path="/explore" exact element={<Explore />} />
        <Route path="/user_profile" exact element={<UserProfile />} />
        <Route path="/create_account" exact element={<CreateAccount />} />
		<Route path='/edit_account' exact element={<EditAccount />} />
		<Route path='/search_users' exact element={<SearchUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
