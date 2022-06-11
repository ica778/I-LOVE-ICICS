import CreateAccount from './CreateAccount';
import LoginCredentials from './LoginCredentials';
import './style.css'

function LoginPage() {
  return (
    <div className="LoginPageInputs">
      <h1>Insert App Name</h1>
      <LoginCredentials />
      <CreateAccount />
    </div>
  );
}

export default LoginPage;
