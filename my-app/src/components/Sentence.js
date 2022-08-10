import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Card, CardContent, Typography, CardActions } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { updateCurrentComments, updateUserId, eraseCurrentComment } from '../actions/index';
import {useSelector, useDispatch} from 'react-redux';

const Sentence = props => {
	const { sentenceBoxId, sentence, noComments } = props;
	const [ commentSectionOpen, setCommentSectionOpen ] = useState(false);
	const [ currentCommentText, setCurrentCommentText ] = useState("");
	const dispatch = useDispatch();

	useEffect(() => {
		console.log(noComments);
	  }, []);

	const handleCommentOpenButton = () => {
		console.log("Hi");
		setCommentSectionOpen(true);
	}

	const handleCommentText = (e) => {
		setCurrentCommentText(e.target.value);
		dispatch(updateCurrentComments({sentenceBoxId, commentText: e.target.value}))
	}

	const handleCloseCommentSection = () => {
		setCommentSectionOpen(false);
		setCurrentCommentText("");
		console.log(sentenceBoxId);
		dispatch(eraseCurrentComment(sentenceBoxId))
	}

	return (
		<div>
			<Card style={commentSectionOpen ? {padding: '7px'} : {padding: '7px', marginBottom: '20px'}}>
				<div>
				<CardContent>
					{sentence}
					<br/>
					<Button onClick={handleCommentOpenButton} style={{position: 'absolute', right: '5em', height: '2em', color: 'lavender', background: '#181818'}}> +{noComments} Comment </Button>
				</CardContent>
				</div>
			</Card>
			{commentSectionOpen && <Card style={{marginTop: '10px', marginBottom: '20px'}}>
				<CardContent>
					<TextField
					id="standard-multiline-flexible"
					label="Comment"
					multiline
					maxRows={5}
					value={currentCommentText}
					onChange={handleCommentText}
					variant="standard"
					/>
				</CardContent>
				<CardActions>
					<Button>Submit</Button>
					<Button onClick={handleCloseCommentSection}>Cancel</Button>
				</CardActions>
			</Card>}
		</div>
	)
}

export default Sentence;