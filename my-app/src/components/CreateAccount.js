import styles from "./CreateAccount.module.scss"
import { Button } from '@material-ui/core';

function CreateAccount() {
    return (
        <div className={styles.createBox}>
            <form className={styles.formControl}>
                <label>Create an Account</label>
                
                <input placeholder="First name" size="20"/>
                <input placeholder="Surname" size="20"/>
                
                <input placeholder="Username" size="20"/>
                
                <input placeholder="Password" size="20"/>
                <input placeholder="Re-enter Password" size="20"/>
                <div className={styles.controls}>
                    <Button>Create</Button>    
                </div>
            </form>
        </div>
    );
}

export default CreateAccount;
