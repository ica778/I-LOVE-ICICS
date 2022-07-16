import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { Card, CardContent, Typography, TextField, Button, CardActions } from '@material-ui/core';
import Dialog from '@mui/material/Dialog';
import { createNewSentence } from '../APIProvider';

export default class UserProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dialogOpen: false,
			source: '',
			text: '',
			highlightedPart: ''
		}
	}

	handleDialogOpen = () => {
		this.setState({ dialogOpen: true });
	}

	handleTextChange = (e) => {
		this.setState({ text: e.target.value });
	}

	handleSourceChange = (e) => {
		this.setState({ source: e.target.value });
	}

	highlightText = () => {
		if (window.getSelection) {
			console.log(window.getSelection());
			let t = window.getSelection().toString();
			t = t.trim();

			this.setState({
				highlightedPart: t
			});
		}
	}

	handleCloseDialog = () => {
		this.setState({ dialogOpen: false, highlightedPart: '', source: '', text: '' })
	}

	handleSubmit = async () => {
		try {
			let res = await createNewSentence(this.state.text, this.state.highlightedPart, this.state.source);
			this.handleCloseDialog();

		} catch (err) {
			console.log(err);
		}
	}

  	render() {
		return <div>
			<Dialog style={{ width: '100%'}} fullWidth={true} maxWidth='xl' open={this.state.dialogOpen} onClose={() => this.setState({dialogOpen: false})}>
				<Card style={{ width: '100%'}}>
					<CardContent>
						<Typography>Text</Typography>
						<TextField style={{width: '50%'}} id="sentenceText" label="Text" variant="outlined" value={this.state.text} onChange={this.handleTextChange}/>
						<Typography>Source of Text</Typography>
						<TextField style={{width: '50%'}} id="sentenceSource" label="Text Source" variant="outlined" value={this.state.source} onChange={this.handleSourceChange}/>
						<Typography style={{position: 'absolute', top: '15px', left: '55%'}}> Text </Typography>
						<div onMouseUp={this.highlightText}>
							<Typography style={{position: 'absolute', top: '35px', left: '55%'}}> {'  ' + this.state.text + '  '} <span>{'  '}</span> </Typography>
						</div>
						<Typography style={{position: 'absolute', top: '50%', left: '55%'}}>{'Highlighted Part: '}{this.state.highlightedPart}</Typography>
					</CardContent>
					<CardActions>
					<Button style={{background: '#01326c', color: 'white'}} onClick={this.handleSubmit}>Submit new sentence</Button>
					<Button style={{background: '#01326c', color: 'white'}} onClick={this.handleCloseDialog}>Cancel</Button>
					</CardActions>
				</Card>
			</Dialog>
			<Button style={{background: '#01326c', color: 'white', position: 'absolute', top: '120px', left: '25px'}} onClick={this.handleDialogOpen}>Create new sentence</Button>
			<Typography variant="h3" style={{ position: 'absolute', top: '180px', left: '25px', backgroundColor: 'white', color: '#065590' }}> Submitted Sentences </Typography>
			<List sx={{ position: 'absolute', top: '250px', left: '25px', width: '45%', bgcolor: '#2288b0' }}>
			<ListItem alignItems="flex-start" style={{width: "100%"}}>
				<div>
					<Card>
						<div>
							<CardContent style={{padding: "10px"}}>
								The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
								<br />
							</CardContent>
						</div>
					</Card>
				</div>
			</ListItem>
			<Divider light="true"/>
			<ListItem alignItems="flex-start">
				<div>
					<Card>
						<div>
							<CardContent style={{padding: "10px"}}>
							The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
								<br />
							</CardContent>
						</div>
					</Card>
				</div>
			</ListItem>
			<Divider variant="inset" component="li" />
			<ListItem alignItems="flex-start">
				<div>
					<Card>
						<div>
							<CardContent style={{padding: "10px"}}>
							The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
								<br />
							</CardContent>
						</div>
					</Card>
				</div>
			</ListItem>
			</List>

			<Typography variant="h3" style={{ position: 'absolute', top: '180px', left: '50%', backgroundColor: 'white', color: '#065590' }}> Saved Sentences </Typography>
			<List sx={{ position: 'absolute', top: '250px', left: '50%', width: '45%', bgcolor: '#2288b0' }}>
			<ListItem alignItems="flex-start" style={{width: "100%"}}>
				<div>
					<Card>
						<div>
							<CardContent style={{padding: "10px"}}>
								The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
								<br />
							</CardContent>
						</div>
					</Card>
				</div>
			</ListItem>
			<Divider light="true"/>
			<ListItem alignItems="flex-start">
				<div>
					<Card>
						<div>
							<CardContent style={{padding: "10px"}}>
							The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
								<br />
							</CardContent>
						</div>
					</Card>
				</div>
			</ListItem>
			<Divider variant="inset" component="li" />
			<ListItem alignItems="flex-start">
				<div>
					<Card>
						<div>
							<CardContent style={{padding: "10px"}}>
							The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
								<br />
							</CardContent>
						</div>
					</Card>
				</div>
			</ListItem>
			</List>
		</div>
	}
}

{/* <span>&nbsp;&nbsp;</span> */}