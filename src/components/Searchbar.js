import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Card, CardContent, Typography, CardActions, List, ListItem } from '@material-ui/core';
import { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {useSelector, useDispatch} from 'react-redux';
import { setCurrentSearchResults, updateCurrentSearchText, updateLatestSearchText } from "../actions";
import { Divider } from "@mui/material";
import { baseUrl } from '../config';
import axios from "axios"
import Dialog from '@mui/material/Dialog';;

function Searchbar() {
	let searchResults = useSelector(function(state) {
		return state.searchpageReducer.currentSearch.searchText;
    });

	const dispatch = useDispatch();

	const [search, setSearch] = useState(searchResults);
	const [highlightedPart, setHighlightedPart] = useState('');
	const [popup, setPopup] = useState(false);

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
		console.log(res.data);
		dispatch(updateLatestSearchText({latestSearchText: search, latestHighlightedText: highlightedPart}));
		dispatch(setCurrentSearchResults(res.data));
	}

	const handleTipPopup = () => {
		setPopup(true);
	}

	return (
		<>
		<Dialog style={{ width: '100%', }} fullWidth={true} maxWidth='xl' open={popup} onClose={() => setPopup(false)}>
			<Card style={{ width: '100%', overflow: 'auto', maxHeight: '100%'}}>
				<CardContent>
					<Typography variant='h3'>How to Search</Typography>
					<div style={{marginTop: '10px'}}/>
					<Typography variant='h5'> There are 3 main customizable components of the search.</Typography>
					<div style={{marginTop: '10px'}}/>
					<List style={{ listStyleType: 'circle'}}>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
							<Typography> The first component allows you to list any words/phrases that you may like to directly include in 
								the search results. This is specified by putting a forward slash before and after each group of words. 
								For example, if you wished to find a sentence including the words "fish" and "to the pond", you could 
								start off your search with /fish/to the pond/. By including a double slash, you can enforce the order 
								in which these phrases must be positioned within the sentence (eg. /fish//to the pond/ will return only 
								sentences with "to the pond" appearing after "fish")</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> Positioned immediately following the first component, the second component allows you to specify a certain 
							phrase that you may want to search up, whilst allowing for ambiguous "placeholder" words which can be 
							specified using these brackets: {`{}`}. Any bracket will be recognized as one exact word in a sentence, 
							so "Bob {`{} {}`} builder" could return "Bob the big builder", or "Bob is a builder". Putting parts of speech 
							inside of brackets is also supported, allowing the user to specify which parts of speech they want to fill in
							the placeholder word with. An example using the parts of speech is Bob 
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> Positioned immediately following the second component, the third and final component allows you to 
							specify which words or phrases you do not wish to include in the results. This is done similarly to the first
							component, but instead of using forward slashes this is accomplished using back slashes (\). For example, to 
							exclude sentences with the phrase "to the beach", you may simply attach \to the beach\ at the end of your 
							search. Similarly to the first component, you may specify as many phrases to exclude as you like by adding 
							more backslashes.
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> The second "Highlighted Part" search bar allows you to search for phrases that other users have 
							highlighted
						</Typography>
						</ListItem>
						<div style={{marginTop: '15px'}}/>
						<Divider></Divider>
						<div style={{marginTop: '15px'}}/>
						<div style={{marginTop: '10px'}}/>
						<div style={{marginTop: '10px'}}/>
						<Typography variant='h5'> Below is the key used for parts of speech. Please keep in mind that using parts of 
						speech to search may not be accurate or reliable 100% of the time.</Typography>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> CC = Coord Conjunction (eg. and, but, or)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> CD = Cardinal Number (eg. one, two)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> DT = Determiner (eg. the, some)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> EX = Existential there (eg. there)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> IN = Proposition (eg. of, in, by)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> JJ = Adjective (eg. big, bigger, smaller, funny)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> MD = Modal (eg. can, should)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> NN = Noun (eg. dog, cat, person)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> PD = Predeterminer (eg. all, both)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> PP = Possessive pronoun (eg. my, one's)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> PR = Personal pronoun (eg. I, you, she)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> RB = Adverb (eg. faster, fastest, slower)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> RP = particle (eg. up, off)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> VB = verb (eg. ate, eat, eating, drank, watched)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> WP = Wh pronoun (eg. who, what, whose)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> WR = Wh adverb (eg. how, where)
						</Typography>
						</ListItem>
						<ListItem style={{ display: 'list-item', left: '20px'}}>
						<Typography> WD = Wh determiner (eg. which, that)
						</Typography>
						</ListItem>


					</List>
				</CardContent>
				<CardActions>
				</CardActions>
			</Card>
		</Dialog>
		<Card style={{ marginBottom: '30px'}}>
			<Button style={{ position: 'absolute', right: '3.25%', background: 'lavender', textTransform: 'none' }} onClick={handleTipPopup}> How to search? </Button>
			<CardContent style={{width: '100%', display: 'block', textAlign: 'center', justifyContent: 'center'}}>
				<Typography style={{marginBottom: '10px'}}>Search a Keyword</Typography>
				<TextField style={{maxWidth: '90%', minWidth: '90%'}} id="searchKeyword" label="Search a phrase or keyword..." variant="outlined" value={search} onChange={handleTextChange}/>
				
				<Typography style={{marginBottom: '10px'}}>Search a Highlighted Part </Typography>
				<TextField style={{maxWidth: '90%', minWidth: '90%'}} id="searchHighlightedPart" label="Search a phrase or keyword... (OPTIONAL)" variant="outlined" value={highlightedPart} onChange={handleTextChange}/>
				<br/>
				<br/>
				<Button style={{ color: 'lavender', background: '#01326c' }} onClick={handleSearch}> Submit </Button>
			</CardContent>
		</Card>
		</>
	)
}

export default Searchbar;