import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import styles from './EditAccount.module.scss';

function EditAccount() {
    return (
        <div className={styles.formBox}>
            <form className={styles.formControl}>
                <label>Edit Account</label>
                <input placeholder="New Username" size="20"/>
                <br/>
                <input placeholder="Enter Current Password" size="20"/>
                <input placeholder="Enter New Password" size="20"/>
                <input placeholder="Re-Enter New Password" size="20"/>
                <br/>
                <label>Edit Email</label>
                <input placeholder="Add Email" size="20"/>
            </form>
            <Button className={styles.input}>Apply Changes</Button>
        </div>
    );
}

export default EditAccount;