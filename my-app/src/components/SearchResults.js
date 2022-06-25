import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Card, CardContent, Typography, CardActions } from '@material-ui/core';
import Sentence from './Sentence';
import { useEffect } from 'react';

function SearchResults(props) {
	let { searchResults } = props;
	searchResults = [
		{
			sentence: 'This is a sentence.',
			noComments: 2,
		},
		{
			sentence: 'The quick brown fox jumps over the lazy dog.',
			noComments: 3
		},
		{
			sentence: 'The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.',
			noComments: 0
		},
	];

	useEffect(() => {
		console.log("from search results!")
		console.log(Array.isArray(searchResults))
	  }, []);

	const renderSentences = (searchResults) => {
		return Array.isArray(searchResults) && searchResults.map((searchResult) => {
			return <li style={{width: '100%'}}>
				<Sentence sentence={searchResult.sentence} noComments={searchResult.noComments}/>
			</li>
		})
	}

	return(
		<div style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
			<ul style={{listStyleType: 'none'}}>
				{renderSentences(searchResults)}
			</ul>
		</div>
	)
}

export default SearchResults;