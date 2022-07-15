import { Button } from '@material-ui/core';
import styles from './SearchUsers.module.scss';

function SearchUsers() {
    return (
        <div className={styles.formBox}>
            <form className={styles.formControl}>
                <input placeholder="Search Username" size="20"/>
            </form>
            <Button className={styles.input}>Search</Button>
        </div>
    );
}

export default SearchUsers;