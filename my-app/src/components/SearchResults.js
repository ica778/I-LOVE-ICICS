import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Card, CardContent, Typography, CardActions } from '@material-ui/core';
import Sentence from './Sentence';
import { useEffect } from 'react';

function SearchResults(props) {
	let { searchResults } = props;
	searchResults = ['This is a sentence.', 'The quick brown fox jumps over the lazy dog.', 'The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the lazy dog.']

	useEffect(() => {
		console.log("from search results!")
		console.log(Array.isArray(searchResults))
	  }, []);

	const renderSentences = (sentences) => {
		return Array.isArray(sentences) && sentences.map((sentence) => {
			return <li style={{width: '100%'}}>
				<Sentence sentence={sentence}/>
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