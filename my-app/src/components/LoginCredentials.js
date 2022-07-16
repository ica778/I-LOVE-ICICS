import { updateUserId } from '../actions/index';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import styles from './LoginCredentials.module.scss';
import { useEffect, useState } from 'react';
import { getUsersAsync } from '../redux/user/thunks';
import { baseUrl } from '../config';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    const handleLogin = async () => {
		try {
			let resp = await axios.post(baseUrl + '/user/login/', {
				username: usernameInput,
				password: passwordInput
			});
			let userId = resp.data;
			console.log(userId);

			localStorage.setItem('userId', userId);
			setUsernameInput('');
			setPasswordInput('');
			toast.success('Successfully logged in.', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} catch (err) {
			console.log(err);
			setPasswordInput('')
			toast.error('Something went wrong with the login. Please try again', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
    }

    const handleLogout = () => {
        setUserId(-1);
        localStorage.clear();
    }

    // // TODO: error handling when login
    // if (localStorage.getItem("userId")) {
    //     return (
    //         <div className={styles.logoutBox}>
    //             <div className={styles.logoutForm}>
    //                 <h1>You are logged in as {localStorage.getItem("userId")}</h1>
    //                 <Button onClick={handleLogout}>Logout</Button>
    //             </div>
                
    //         </div>
    //     )
    // }

    return (
        <div className={styles.loginBox}>
            <form className={styles.formControl}>
                <label>Login</label>
                <input value={usernameInput} onChange={(e) => setUsernameInput(e.target.value) } placeholder="Username" size="20"/>
                <input value={passwordInput} onChange={(e) => setPasswordInput(e.target.value) } placeholder="Password" size="20"/>
            </form>
            <Button className={styles.input} onClick={handleLogin}>Login</Button>
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				closeOnClick
				rtl={false}
				newestOnTop={true}
				/>
        </div>
    );
}

export default LoginCredentials;
