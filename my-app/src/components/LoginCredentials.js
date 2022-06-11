import './style.css';

function LoginCredentials() {
    return (
        <div className="LoginCredentials">
            <form>
                <b>Login</b>
                <input placeholder="Username" size="20"/>
                <input placeholder="Password" size="20"/>
                <button>Login</button>
            </form>
        </div>
    );
}

export default LoginCredentials;
