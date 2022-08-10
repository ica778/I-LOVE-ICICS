import { updateUserId } from '../actions/index';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton, TextField } from '@material-ui/core';
import styles from './LoginCredentials.module.scss';
import { useEffect, useState } from 'react';
import { getUsersAsync } from '../redux/user/thunks';
import { baseUrl } from '../config';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function LoginCredentials() {
  const [userId, setUserId] = useState();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      let resp = await axios.post(baseUrl + '/user/login/', {
        username: usernameInput,
        password: passwordInput,
      });
      let userId = resp.data;
      console.log(userId);

      localStorage.setItem('userId', userId);
      localStorage.setItem('username', usernameInput);
      setUsernameInput('');
      setPasswordInput('');
      toast.success('Successfully logged in.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      console.log(err);
      let errorMessage =
        'Something went wrong with the login. Please try again';
      if (err.response.status == 404) {
        errorMessage = 'User with those credentials not found';
      }
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleLogout = () => {
    setUserId(-1);
    localStorage.clear();
  };

  let isLoggedIn = (
    <div className={styles.loginBox}>
      <form className={styles.formControl}>
        <label>Login</label>
        <TextField
          value={usernameInput}
          onChange={e => setUsernameInput(e.target.value)}
          placeholder="Username"
          size="20"
        />
        <TextField
          value={passwordInput}
          onChange={e => setPasswordInput(e.target.value)}
          placeholder="Password"
          size="20"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <IconButton
                edge="end"
                color="primary"
                onClick={handleClickShowPassword}
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            ),
          }}
        />
      </form>
      <Button className={styles.input} onClick={handleLogin}>
        Login
      </Button>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        newestOnTop={true}
      />
    </div>
  );

  if (localStorage.getItem('userId')) {
    isLoggedIn = (
      <div className={styles.logoutBox}>
        <div className={styles.logoutForm}>
          <h1>You are logged in as {localStorage.getItem('username')}</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    );
  }

  return <div>{isLoggedIn}</div>;
}

export default LoginCredentials;
