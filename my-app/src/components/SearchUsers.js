import { Button } from '@material-ui/core';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUsersSearchName } from '../redux/user/thunks';
import styles from './SearchUsers.module.scss';

// TODO: make proper UI 
function SearchUsers() {
    const dispatch = useDispatch();

    let usersToDisplay = [];

    const [usernameInput, setUsernameInput] = useState("");
    function setUsername(val) {
        setUsernameInput(val.target.value);
    }

    const [users, setUsers] = useState([]);


    const handleSearch = () => {
        dispatch(getUsersSearchName(usernameInput)).then(value => {
            usersToDisplay = [];
            for (let x of value.payload) {
                usersToDisplay.push({username: x.username});
            }
            
            setUsers(usersToDisplay);
            console.log(JSON.stringify(users));
        })
    }

    const listItems = users.map((d) => <li>
        Username: {d.username}
    </li>);

    return (
        <div className={styles.formBox}>
            <form className={styles.formControl}>
                <input value={usernameInput} onChange={setUsername} placeholder="Search Username" size="20"/>
            </form>
            <Button className={styles.input} onClick={handleSearch}>Search</Button>
            <ul className={styles.display}>
                {listItems}
            </ul>
        </div>
    );
}

export default SearchUsers;