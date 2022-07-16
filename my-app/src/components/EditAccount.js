import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import styles from './EditAccount.module.scss';
import { useState } from 'react';
import { updateUsernameAsync } from '../redux/user/thunks';

function EditAccount() {
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    function setUsernameInput(val) {
        setUsername(val.target.value);
    }
    const [currentPassword, setCurrentPassword] = useState('');
    function setCurrentPasswordInput(val) {
        setCurrentPassword(val.target.value);
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

    function handleEditAccount() {
        dispatch(updateUsernameAsync({'id': localStorage.getItem('userId'), 'username': username}));
        localStorage.setItem('userId', username);
    } 

    return (
        <div className={styles.formBox}>
            <form className={styles.formControl}>
                <label>Edit Account</label>
                <input value={username} onChange={setUsernameInput} placeholder="New Username" size="20"/>
                <br/>
                <input value={currentPassword} onChange={setCurrentPasswordInput} placeholder="Enter Current Password" size="20"/>
                <input value={password} onChange={setPassword} placeholder="Enter New Password" size="20"/>
                <input value={passwordRedo} onChange={setPasswordRedo} placeholder="Re-Enter New Password" size="20"/>
                <br/>
                <label>Edit Email</label>
                <input value={email} onChange={setEmailInput} placeholder="Add Email" size="20"/>
            </form>
            <Button className={styles.input} onClick={handleEditAccount}>Apply Changes</Button>
        </div>
    );
}

export default EditAccount;