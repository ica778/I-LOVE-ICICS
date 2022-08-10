import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton, TextField } from '@material-ui/core';
import styles from './EditAccount.module.scss';
import { useState } from 'react';
import { updateAccountInformationAsync } from '../redux/user/thunks';
import { ToastContainer, toast } from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function EditAccount() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  function setUsernameInput(val) {
    setUsername(val.target.value);
  }
  const [password, setPassword] = useState('');
  function setPasswordInput(val) {
    setPassword(val.target.value);
  }
  const [passwordRedo, setPasswordRedo] = useState('');
  function setPasswordRedoInput(val) {
    setPasswordRedo(val.target.value);
  }
  const [email, setEmail] = useState('');
  function setEmailInput(val) {
    setEmail(val.target.value);
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  function handleEditAccount() {
    if (username) {
      dispatch(
        updateAccountInformationAsync({
          id: localStorage.getItem('username'),
          username: username,
        })
      );
      localStorage.setItem('username', username);
      toast.success('Your new username is: ' + username, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (password && password === passwordRedo) {
      dispatch(
        updateAccountInformationAsync({
          id: localStorage.getItem('username'),
          password: password,
        })
      );
      toast.success('Your new password is: ' + password, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  return (
    <div className={styles.formBox}>
      <form className={styles.formControl}>
        <label>Edit Account</label>
        <TextField
          value={username}
          onChange={setUsernameInput}
          placeholder="New Username"
          size="15"
        />
        <br />
        <TextField
          value={password}
          onChange={setPasswordInput}
          placeholder="Enter New Password"
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
          value={passwordRedo}
          onChange={setPasswordRedoInput}
          placeholder="Re-Enter New Password"
          size="15"
          type={showPasswordConfirm ? 'text' : 'password'}
        />
        <br />
        <label>Edit Email</label>
        <TextField
          value={email}
          onChange={setEmailInput}
          placeholder="Add Email"
          size="15"
        />
      </form>
      <Button className={styles.input} onClick={handleEditAccount}>
        Apply Changes
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
}

export default EditAccount;
