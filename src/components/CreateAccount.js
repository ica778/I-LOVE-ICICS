import styles from './CreateAccount.module.scss';
import { Button, IconButton, TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { addUserAsync } from '../redux/user/thunks';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { baseUrl } from '../config';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function CreateAccount() {
  const dispatch = useDispatch();

  const [usernameInput, setUsernameInput] = useState('');

  const [passwordInput, setPasswordInput] = useState('');

  const [passwordConfirmationInput, setPasswordConfirmationInput] =
    useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleCreateAccountButton = async () => {
    try {
      let resp = await axios.post(baseUrl + '/user/create', {
        username: usernameInput,
        password: passwordInput,
      });
      let userId = resp.data;
      console.log(userId);
      localStorage.setItem('userId', userId);
      setUsernameInput('');
      setPasswordInput('');
      setPasswordConfirmationInput('');
      toast.success('Successfully created account.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      toast.error(
        'Something went wrong with creating your account. Please try again',
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };

  return (
    <div className={styles.createBox}>
      <form className={styles.formControl}>
        <label>Create an Account</label>

        <TextField placeholder="First name" size="15" />
        <TextField placeholder="Surname" size="15" />

        <TextField
          value={usernameInput}
          onChange={e => setUsernameInput(e.target.value)}
          placeholder="Username"
          size="15"
        />

        <TextField
          value={passwordInput}
          onChange={e => setPasswordInput(e.target.value)}
          placeholder="Password"
          size="15"
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
        <TextField
          value={passwordConfirmationInput}
          onChange={e => setPasswordConfirmationInput(e.target.value)}
          placeholder="Re-enter Password"
          size="15"
          type={showPasswordConfirm ? 'text' : 'password'}
        />
        <div className={styles.controls}>
          <Button onClick={handleCreateAccountButton}>Create</Button>
        </div>
      </form>
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
}

export default CreateAccount;
