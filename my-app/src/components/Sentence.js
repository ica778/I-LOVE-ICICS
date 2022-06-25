import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Card, CardContent, Typography, CardActions } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

function Sentence(props) {
	const { sentence, noComments } = props;

	useEffect(() => {
		console.log(noComments);
	  }, []);

	return (
		<Card style={{padding: '7px', marginBottom: '20px'}}>
			<div>
			<CardContent>
				{sentence}
				<br/>
				<Button style={{minWidth: '20px', minHeight: '20px', maxWidth: '20px', maxHeight: '20px', position: 'absolute', right: '12em', height: '1.5em'}}>+{noComments}</Button>
				{/* <Typography style={{position: 'absolute', right:'10.5em', lineHeight: '1.3', fontSize: '1rem'}} variant="button">+{noComments}</Typography> */}
				<Button style={{position: 'absolute', right: '5em', height: '1.5em', color: 'lavender', background: '#181818'}}> Comment </Button>
			</CardContent>
			</div>
		</Card>
	)
}

export default Sentence;