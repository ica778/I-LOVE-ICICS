import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Card, CardContent, Typography, CardActions } from '@material-ui/core';
import { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {useSelector, useDispatch} from 'react-redux';
import { updateCurrentSearchResults, updateCurrentSearchText } from "../actions";
import { Divider } from "@mui/material";
import { baseUrl } from '../config';
import axios from "axios";

function Searchbar() {
	let searchResults = useSelector(function(state) {
		return state.searchpageReducer.currentSearch.searchText;
    });

	const dispatch = useDispatch();

	const [search, setSearch] = useState(searchResults);
	const [highlightedPart, setHighlightedPart] = useState('');

	const CssTextField = withStyles({
		root: {
		  '& label.Mui-focused': {
			color: 'black',
		  },
		  '& .MuiInput-underline:after': {
			borderBottomColor: 'black',
		  },
		  '& .MuiOutlinedInput-root': {
			'& fieldset': {
			  borderColor: 'black',
			},
			'&:hover fieldset': {
			  borderColor: 'black',
			},
			'&.Mui-focused fieldset': {
			  borderColor: 'black',
			},
		  },
		},
	  })(TextField);

	const handleTextChange = (e) => {
		if (e.target.id === 'searchKeyword') {
			setSearch(e.target.value);
			dispatch(updateCurrentSearchText(e.target.value))
		} else {
			setHighlightedPart(e.target.value);
		}
	}

	const handleSearch = async () => {
		// need to send importantpart joined by '/' to server
		let res = await axios.get(baseUrl + '/sentence/search', {
			params: {
				search,
				highlightedPart
			}
		})
		console.log(res.data);
		await axios.put(baseUrl + '/sentence/viewcount', {
			ids: res.data
		})
		dispatch(updateCurrentSearchResults(res.data));
	}

	return (
		<Card style={{ marginBottom: '30px'}}>
			<CardContent style={{width: '100%', display: 'block', textAlign: 'center', justifyContent: 'center'}}>
				<Typography style={{marginBottom: '10px'}}>Search a Keyword</Typography>
				<TextField style={{maxWidth: '90%', minWidth: '90%'}} id="searchKeyword" label="Search a phrase or keyword..." variant="outlined" value={search} onChange={handleTextChange}/>
				
				<Typography style={{marginBottom: '10px'}}>Search an Important Part </Typography>
				<TextField style={{maxWidth: '90%', minWidth: '90%'}} id="searchHighlightedPart" label="Search a phrase or keyword... (OPTIONAL)" variant="outlined" value={highlightedPart} onChange={handleTextChange}/>
				<br/>
				<br/>
				<Button style={{ color: 'lavender', background: '#01326c' }} onClick={handleSearch}> Submit </Button>
			</CardContent>
		</Card>
	)
}

export default Searchbar;