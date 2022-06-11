import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Card, CardContent, Typography, CardActions } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

function Sentence(props) {
	const { sentence } = props;

	useEffect(() => {
		console.log("from sentence!")
	  }, []);

	return (
		<Card style={{marginBottom: '20px'}}>
			<div>
			<CardContent>
				{sentence}
				<br/>
				<Button style={{position: 'absolute', right: '5em', height: '1.5em', color: 'lavender', background: '#181818'}}> Comment </Button>
			</CardContent>
			</div>
		</Card>
	)
}

export default Sentence;