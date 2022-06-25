import { updateUserId } from '../actions/index';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';

function LoginCredentials() {
    const dispatch = useDispatch();

    const handleLogin = () => {
        dispatch(updateUserId(1234));
    }

    return (
        <div >
            <form >
                <b>Login</b>
                <input placeholder="Username" size="20"/>
                <input placeholder="Password" size="20"/>
            </form>
            <Button onClick={handleLogin}>Login</Button>
        </div>
    );
}

export default LoginCredentials;
