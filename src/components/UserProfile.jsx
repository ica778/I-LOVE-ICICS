import React, { useEffect } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { Card, CardContent, Typography, TextField, Button, CardActions } from '@material-ui/core';
import Dialog from '@mui/material/Dialog';
import { useState } from 'react';
import { createNewSentence } from '../APIProvider';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { baseUrl } from '../config'
import { updateUserSavedSentences, updateUserProfileMode, updateUserSubmittedSentences } from '../actions';

const UserProfile = props => {

	const [dialogOpen, setDialogOpen] = useState(false);
	const [source, setSource] = useState('');
	const [text, setText] = useState('');
	const [highlightedPart, setHighlightedPart] = useState('');

	const dispatch = useDispatch();

	let userSavedSentences = useSelector(function (state) {
		return state.userReducer.userSavedSentences;
	});

	let userSubmittedSentences = useSelector(function (state) {
		return state.userReducer.userSubmittedSentences;
	});

	let otherSavedSentences = useSelector(function (state) {
		return state.userReducer.otherSavedSentences;
	});

	let otherSubmittedSentences = useSelector(function (state) {
		return state.userReducer.otherSubmittedSentences;
	});

	let userProfileMode = useSelector(function (state) {
		return state.userReducer.userProfileMode;
	});

	const handleDialogOpen = () => {
		if (userProfileMode === 'self') {
			setDialogOpen(true);
		} else if (userProfileMode === 'other') {
			dispatch(updateUserProfileMode('self'));
		}
	}

	const handleTextChange = (e) => {
		setText(e.target.value);
	}

	const handleSourceChange = (e) => {
		setSource(e.target.value);
	}

	const fetchSentenceData = async () => {
		try {
			const userId = localStorage.getItem('userId');
			const res = await axios.get(baseUrl + `/user/${userId}/sentences`);
			dispatch(updateUserSavedSentences(res.data.savedSentences));
			dispatch(updateUserSubmittedSentences(res.data.submittedSentences));
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		fetchSentenceData();
	}, [])

	const highlightText = () => {
		if (window.getSelection) {
			console.log(window.getSelection());
			let t = window.getSelection().toString();
			t = t.trim();

			setHighlightedPart(t);
		}
	}

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setHighlightedPart('');
		setSource('');
		setText('');
	}

	const handleSubmit = async () => {
		try {
			let res = await createNewSentence(text, highlightedPart, source);
			dispatch(updateUserSubmittedSentences([...userSubmittedSentences, {_id: res._id, text: res.text, comments: res.comments}]));
			handleCloseDialog();

		} catch (err) {
			console.log(err);
		}
	}

	const renderSubmittedSentences = () => {
		console.log('here');
		console.log(userSubmittedSentences);
		if (userProfileMode === 'self') {
			if (Array.isArray(userSubmittedSentences)) {
				if (userSubmittedSentences.length === 0) {
					return <ListItem alignItems="flex-start" style={{width: "100%"}}>
					<div>
						<Card>
							<div>
								<CardContent style={{padding: "10px"}}>
									There doesn't seem to be anything here...
								</CardContent>
							</div>
						</Card>
					</div>
				</ListItem>
				} else {
					return userSubmittedSentences.map((sentence) => {
						console.log(sentence.text);
						return <ListItem alignItems="flex-start" style={{width: "100%"}}>
						<div>
							<Card>
								<div>
									<CardContent style={{padding: "10px"}}>
										{sentence.text}
										<br />
									</CardContent>
								</div>
							</Card>
						</div>
					</ListItem>
					})
				}
			}
		} else if (userProfileMode === 'other') {
			if (Array.isArray(otherSubmittedSentences)) {
				if (otherSubmittedSentences.length === 0) {
					return <ListItem alignItems="flex-start" style={{width: "100%"}}>
					<div>
						<Card>
							<div>
								<CardContent style={{padding: "10px"}}>
									There doesn't seem to be anything here...
								</CardContent>
							</div>
						</Card>
					</div>
				</ListItem>
				} else {
					return otherSubmittedSentences.map((sentence) => {
						return <ListItem alignItems="flex-start" style={{width: "100%"}}>
						<div>
							<Card>
								<div>
									<CardContent style={{padding: "10px"}}>
										{sentence.text}
										<br />
									</CardContent>
								</div>
							</Card>
						</div>
					</ListItem>
					});
				}
			}
		}
	}

	const renderSavedSentences = () => {
		console.log(userSavedSentences);
		if (userProfileMode === 'self') {
			if (Array.isArray(userSavedSentences)) {
				if (userSavedSentences.length === 0) {
					return <ListItem alignItems="flex-start" style={{width: "100%"}}>
					<div>
						<Card>
							<div>
								<CardContent style={{padding: "10px"}}>
									There doesn't seem to be anything here...
								</CardContent>
							</div>
						</Card>
					</div>
				</ListItem>
				} else {
					return userSavedSentences.map((sentence) => {
						return <ListItem alignItems="flex-start" style={{width: "100%"}}>
						<div>
							<Card>
								<div>
									<CardContent style={{padding: "10px"}}>
										{sentence.text}
										<br />
									</CardContent>
								</div>
							</Card>
						</div>
					</ListItem>
					})
				}
			}
		} else if (userProfileMode === 'other') {
			if (Array.isArray(otherSavedSentences)) {
				if (otherSavedSentences.length === 0) {
					return <ListItem alignItems="flex-start" style={{width: "100%"}}>
					<div>
						<Card>
							<div>
								<CardContent style={{padding: "10px"}}>
									There doesn't seem to be anything here...
								</CardContent>
							</div>
						</Card>
					</div>
				</ListItem>
				} else {
					return otherSavedSentences.map((sentence, i) => {
						return <> <ListItem alignItems="flex-start" style={{width: "100%"}}>
						<div>
							<Card>
								<div>
									<CardContent style={{padding: "10px"}}>
										{sentence.text}
										<br />
									</CardContent>
								</div>
							</Card>
						</div>
					</ListItem> {i < sentence.length - 1 && <Divider variant="inset" component="li" />} </>
					})
				}
			}
		}
	}

  	return (
		<div>
			<Dialog style={{ width: '100%'}} fullWidth={true} maxWidth='xl' open={dialogOpen} onClose={() => setDialogOpen(false)}>
				<Card style={{ width: '100%'}}>
					<CardContent>
						<Typography>Text</Typography>
						<TextField style={{width: '50%'}} id="sentenceText" label="Text" variant="outlined" value={text} onChange={handleTextChange}/>
						<Typography>Source of Text</Typography>
						<TextField style={{width: '50%'}} id="sentenceSource" label="Text Source" variant="outlined" value={source} onChange={handleSourceChange}/>
						<Typography style={{position: 'absolute', top: '15px', left: '55%'}}> Text </Typography>
						<div onMouseUp={highlightText}>
							<Typography style={{position: 'absolute', top: '35px', left: '55%'}}> {'  ' + text + '  '} <span>{'  '}</span> </Typography>
						</div>
						<Typography style={{position: 'absolute', top: '50%', left: '55%'}}>{'Highlighted Part: '}{highlightedPart}</Typography>
					</CardContent>
					<CardActions>
					<Button style={{background: '#01326c', color: 'white'}} onClick={handleSubmit}>Submit new sentence</Button>
					<Button style={{background: '#01326c', color: 'white'}} onClick={handleCloseDialog}>Cancel</Button>
					</CardActions>
				</Card>
			</Dialog>
			<Button style={{background: '#01326c', color: 'white', position: 'absolute', top: '120px', left: '25px'}} onClick={handleDialogOpen}>{userProfileMode === 'self' ? 'Create new sentence' : 'My Profile'} </Button>
			<Typography variant="h3" style={{ position: 'absolute', top: '180px', left: '25px', backgroundColor: 'white', color: '#065590' }}> Submitted Sentences </Typography>
			<List sx={{ position: 'absolute', top: '250px', left: '25px', width: '45%', bgcolor: '#2288b0' }}>
				{renderSubmittedSentences()}
			</List>

			<Typography variant="h3" style={{ position: 'absolute', top: '180px', left: '50%', backgroundColor: 'white', color: '#065590' }}> Saved Sentences </Typography>
			<List sx={{ position: 'absolute', top: '250px', left: '50%', width: '45%', bgcolor: '#2288b0' }}>
			{renderSavedSentences()}
			</List>
		</div>
	)
}

export default UserProfile;