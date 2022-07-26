import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Card, CardContent, Typography, CardActions } from '@material-ui/core';
import Sentence from './Sentence';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

function SearchResults(props) {
  useEffect(() => {
    console.log('from search results!');
    console.log(Array.isArray(searchResults));
  }, []);

  let searchResults = useSelector(function (state) {
    return state.searchpageReducer.currentSearch.results;
  });

  const renderSentences = searchResults => {
    return (
      Array.isArray(searchResults) &&
      searchResults.map(searchResult => {
		console.log(searchResult);
        return (
          <li key={searchResult.sentenceBoxId} style={{ width: '100%' }}>
            <Sentence
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
