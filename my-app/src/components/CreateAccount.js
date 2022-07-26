import styles from "./CreateAccount.module.scss"
import { Button } from '@material-ui/core';
import { useDispatch } from "react-redux";
import { useState } from "react";
import { addUserAsync } from "../redux/user/thunks";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { baseUrl } from "../config";

function CreateAccount() {
    const dispatch = useDispatch();

    const [usernameInput, setUsernameInput] = useState("");

    const [passwordInput, setPasswordInput] = useState("");

    const [passwordConfirmationInput, setPasswordConfirmationInput] = useState("");


    const handleCreateAccountButton = async () => {
        try {
			let resp = await axios.post(baseUrl + '/user/create', {
				username: usernameInput,
				password: passwordInput
			});
			let userId = resp.data;
			console.log(userId);
			localStorage.setItem('userId', userId);
			setUsernameInput('');
			setPasswordInput('');
			setPasswordConfirmationInput('');
			toast.success('Successfully created account.', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			})
		} catch (err) {
			toast.error('Something went wrong with creating your account. Please try again', {
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

    return (
        <div className={styles.createBox}>
            <form className={styles.formControl}>
                <label>Create an Account</label>
                
                <input placeholder="First name" size="20"/>
                <input placeholder="Surname" size="20"/>
                
                <input value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} placeholder="Username" size="20"/>
                
                <input value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Password" size="20"/>
                <input value={passwordConfirmationInput} onChange={(e) => setPasswordConfirmationInput(e.target.value)} placeholder="Re-enter Password" size="20"/>
                <div className={styles.controls}>
                    <Button onClick={handleCreateAccountButton}>Create</Button>    
                </div>
            </form>
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

export default CreateAccount;
