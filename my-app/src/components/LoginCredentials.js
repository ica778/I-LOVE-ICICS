import { updateUserId } from '../actions/index';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import styles from './LoginCredentials.module.scss'

function LoginCredentials() {
    const dispatch = useDispatch();

    const handleLogin = () => {
        dispatch(updateUserId(1234));
    }

    return (
        <div className={styles.loginBox}>
            <form className={styles.formControl}>
                <label>Login</label>
                <input placeholder="Username" size="20"/>
                <input placeholder="Password" size="20"/>
            </form>
            <Button className={styles.input} onClick={handleLogin}>Login</Button>
        </div>
    );
}

export default LoginCredentials;
