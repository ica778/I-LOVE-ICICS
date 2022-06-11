import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Card, CardContent, Typography, CardActions } from '@material-ui/core';
import { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';

function Searchbar() {
	const [search, setSearch] = useState("");
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

	return (
		<Card style={{ marginBottom: '30px'}}>
			<CardContent style={{width: '100%', display: 'block', textAlign: 'center', justifyContent: 'center'}}>
				<Typography style={{marginBottom: '10px'}}>Search a Keyword</Typography>
				<CssTextField style={{maxWidth: '90%', minWidth: '90%'}} id="searchKeyword" label="Search a phrase or keyword..." variant="outlined" value={search} onChange={(e) => setSearch(e.target.value)}/>
				{/* <TextField style={{maxWidth: '90%', minWidth: '90%'}} id="searchKeyword" label="Search a phrase or keyword..." variant="outlined" value={search} onChange={(e) => setSearch(e.target.value)}/> */}
			</CardContent>
		</Card>
	)
}

export default Searchbar;