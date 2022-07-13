import Searchbar from "./Searchbar";
import SearchResults from './SearchResults';
import styles from "./MainPage.module.scss";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function MainPage() {
  //testing
  const userId = useSelector(state => state.userReducer.userId);

  return (
    <div className={styles.container}>
      <Searchbar />
      <SearchResults />
    </div>
  );
}

export default MainPage;
