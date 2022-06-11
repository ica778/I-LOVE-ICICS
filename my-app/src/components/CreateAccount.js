import './style.css';

function CreateAccount() {
    return (
        <div className="CreateAccount">
            <form>
                <b>Create an Account</b>
                <br />
                <input placeholder="First name" size="20"/>
                <input placeholder="Surname" size="20"/>
                <br />
                <input placeholder="Username" size="20"/>
                <br />
                <input placeholder="Password" size="20"/>
                <input placeholder="Re-enter Password" size="20"/>
                <br />
                <button>Create</button>
            </form>
        </div>
    );
}

export default CreateAccount;
