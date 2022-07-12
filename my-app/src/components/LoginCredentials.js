import { updateUserId } from '../actions/index';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import styles from './LoginCredentials.module.scss';
import { useState } from 'react';

function LoginCredentials() {
    const dispatch = useDispatch();

    const [usernameInput, setUsernameInput] = useState("");
    function setUsername(val) {
        setUsernameInput(val.target.value);
    }

    const [passwordInput, setPasswordInput] = useState("");
    function setPassword(val) {
        setPasswordInput(val.target.value);
    }

    const handleLogin = () => {
        dispatch(updateUserId(usernameInput));
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
