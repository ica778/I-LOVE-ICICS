import styles from "./CreateAccount.module.scss"

function CreateAccount() {
    return (
        <div className={styles.createBox}>
            <form className={styles.formControl}>
                <b>Create an Account</b>
                
                <input placeholder="First name" size="20"/>
                <input placeholder="Surname" size="20"/>
                
                <input placeholder="Username" size="20"/>
                
                <input placeholder="Password" size="20"/>
                <input placeholder="Re-enter Password" size="20"/>
                <div className={styles.controls}>
                    <button>Create</button>    
                </div>
            </form>
        </div>
    );
}

export default CreateAccount;
