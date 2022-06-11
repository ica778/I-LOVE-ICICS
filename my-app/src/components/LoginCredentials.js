import './style.css';

function LoginCredentials() {
     return (
        <div>
            <h1>Login</h1>
            <form>
                <input placeholder="Username"/>
                <br />
                <input placeholder="Password"/>
            </form>
            <div>
                <button>Login</button>
                <button>Create Account</button>
            </div>
        </div>
    );
}

export default LoginCredentials;
