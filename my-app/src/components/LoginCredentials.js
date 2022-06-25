import styles from "./LoginCredentials.module.scss"

function LoginCredentials() {
    return (
        <div className={styles.loginBox}>
            <form className={styles.formControl}>
                <b>Login</b>
                <input placeholder="Username" size="20"/>
                <input placeholder="Password" size="20"/>
                <button>Login</button>
            </form>
        </div>
    );
}

export default LoginCredentials;
