import Searchbar from "./Searchbar";
import SearchResults from './SearchResults';
import styles from "./MainPage.module.scss"

function MainPage() {

  return (
    <div className={styles.container}>
      <Searchbar />
      <SearchResults />
    </div>
  );
}

export default MainPage;
