import styles from "./CreateAccount.module.scss"
import { Button } from '@material-ui/core';
import { useDispatch } from "react-redux";
import { useState } from "react";
import { addUserAsync } from "../redux/user/thunks";

function CreateAccount() {
    const dispatch = useDispatch();

    const [usernameInput, setUsernameInput] = useState("");
    function setUsername(val) {
        setUsernameInput(val.target.value);
    }

    const [passwordInput, setPasswordInput] = useState("");
    function setPassword(val) {
        setPasswordInput(val.target.value);
    }

    const [passwordConfirmationInput, setPasswordConfirmationInput] = useState("");
    function setPasswordConfirmation(val) {
        setPasswordConfirmationInput(val.target.value);
    }

    // TODO: correct exception handling and prompts
    const handleCreateAccountButton = () => {
        if (passwordInput === passwordConfirmationInput && usernameInput.length > 0 && passwordInput.length > 0) {
            console.log(dispatch(addUserAsync({username: usernameInput, password: passwordInput})));
            alert("user created");
        }
        else {
            alert("Username and passwords empty or passwords don't match");
        }
    }

    return (
        <div className={styles.createBox}>
            <form className={styles.formControl}>
                <label>Create an Account</label>
                
                <input placeholder="First name" size="20"/>
                <input placeholder="Surname" size="20"/>
                
                <input value={usernameInput} onChange={setUsername} placeholder="Username" size="20"/>
                
                <input value={passwordInput} onChange={setPassword} placeholder="Password" size="20"/>
                <input value={passwordConfirmationInput} onChange={setPasswordConfirmation} placeholder="Re-enter Password" size="20"/>
                <div className={styles.controls}>
                    <Button onClick={handleCreateAccountButton}>Create</Button>    
                </div>
            </form>
        </div>
    );
}

export default CreateAccount;
