import { updateUserId } from '../actions/index';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import styles from './LoginCredentials.module.scss';
import { useEffect, useState } from 'react';
import { getUsersAsync } from '../redux/user/thunks';

function LoginCredentials() {
    const dispatch = useDispatch();

    const [userId, setUserId] = useState();

    const [usernameInput, setUsernameInput] = useState("");
    function setUsername(val) {
        setUsernameInput(val.target.value);
    }

    const [passwordInput, setPasswordInput] = useState("");
    function setPassword(val) {
        setPasswordInput(val.target.value);
    }

    const handleLogin = () => {
        dispatch(getUsersAsync()).then(value => {
            let found = value.payload.find(element => element.username === usernameInput && element.password === passwordInput);
            if (found !== null) {
                setUserId(found.username);
                localStorage.setItem('userId', found.username);
            }
        });
    }

    const handleLogout = () => {
        setUserId(-1);
        localStorage.clear();
    }

    // TODO: error handling when login
    if (localStorage.getItem("userId")) {
        return (
            <div className={styles.logoutBox}>
                <div className={styles.logoutForm}>
                    <h1>You are logged in as {localStorage.getItem("userId")}</h1>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>
                
            </div>
        )
    }

    return (
        <div className={styles.loginBox}>
            <form className={styles.formControl}>
                <label>Login</label>
                <input value={usernameInput} onChange={setUsername} placeholder="Username" size="20"/>
                <input value={passwordInput} onChange={setPassword} placeholder="Password" size="20"/>
            </form>
            <Button className={styles.input} onClick={handleLogin}>Login</Button>
        </div>
    );
}

export default LoginCredentials;
