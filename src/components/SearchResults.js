import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Card, CardContent, Typography, CardActions } from '@material-ui/core';
import Sentence from './Sentence';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bottomOfPage, updateCurrentSearchResults } from '../actions';
import { baseUrl } from '../config';
import axios from "axios";

function SearchResults(props) {
  useEffect(() => {
    console.log('from search results!');
    console.log(Array.isArray(searchResults));
  }, []);
  const dispatch = useDispatch();

  let searchResults = useSelector(function (state) {
    return state.searchpageReducer.currentSearch.results;
  });

  let latestSearchText = useSelector(function (state) {
    return state.searchpageReducer.latestSearchText;
  });

  let latestHighlightText = useSelector(function (state) {
    return state.searchpageReducer.latestHighlightText;
  });

  let atBottomOfPage = useSelector(function (state) {
    return state.searchpageReducer.atBottomOfPage;
  });

  async function fetchNextSearch() {
    console.log(latestSearchText);
    console.log(latestHighlightText);
    if (searchResults.length > 0) {
      let id = searchResults[searchResults.length - 1]._id;
      console.log(id);
      let res = await axios.get(baseUrl + '/sentence/search', {
        params: {
          search: latestSearchText,
          highlightedPart: latestHighlightText,
          lastSentenceId: id
        }
      });
      if (res) {
        dispatch(updateCurrentSearchResults(res.data));
      }
    }
  }

  useEffect(() => {
    if (atBottomOfPage) {
      if (searchResults.length > 0) {
        fetchNextSearch();
      }
      dispatch(bottomOfPage(null));
      setTimeout(function() {
        dispatch(bottomOfPage(false));
      }, 500);
    }
  }, [atBottomOfPage]);

  const renderSentences = searchResults => {
    return (
      Array.isArray(searchResults) &&
      searchResults.map(searchResult => {
		console.log(searchResult);
        return (
          <li key={searchResult.sentenceBoxId} style={{ width: '100%' }}>
            <Sentence
			  userid={searchResult.submittedBy}
              id={searchResult._id}
              text={searchResult.text}
              comments={searchResult.comments}
			  highlightedPart={searchResult.highlightedPart}
            />
          </li>
        );
      })
    );
  };

  return (
    <div
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
      }}
    >
      <ul style={{ listStyleType: 'none', width: '100%' }}>
        {renderSentences(searchResults)}
      </ul>
    </div>
  );
}

export default SearchResults;
